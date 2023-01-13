import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import UpdateSyncTask from '.';
import { IInstanceTaskDetailResV1 } from '../../../api/common';
import sync_instance from '../../../api/sync_instance';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import {
  mockDriver,
  mockUseGlobalRuleTemplate,
  mockUseTaskSource,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { createMemoryHistory } from 'history';

export const defaultSyncTask: IInstanceTaskDetailResV1 = {
  db_type: 'mysql',
  id: 0,
  source: 'source1',
  url: 'http://192.168.1.1:3000',
  version: '4.2.2.0',
  sync_instance_interval: '0 0 * * *',
  rule_template: 'global_rule_template_name1',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const taskId = '99';

describe('test UpdateSyncTask', () => {
  let updateSyncInstanceTaskSpy: jest.SpyInstance;
  let getSyncInstanceTaskSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockDriver();
    mockUseTaskSource();
    mockUseGlobalRuleTemplate();
    updateSyncInstanceTaskSpy = mockUpdateSyncInstanceTask();
    getSyncInstanceTaskSpy = mockGetSyncInstanceTask();
    useParamsMock.mockReturnValue({ taskId });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockUpdateSyncInstanceTask = () => {
    const spy = jest.spyOn(sync_instance, 'updateSyncInstanceTaskV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockGetSyncInstanceTask = () => {
    const spy = jest.spyOn(sync_instance, 'GetSyncInstanceTask');
    spy.mockImplementation(() => resolveThreeSecond(defaultSyncTask));
    return spy;
  };

  test('should match snapshot', () => {
    const { baseElement } = renderWithRouter(<UpdateSyncTask />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should get default value with request and taskId', async () => {
    expect(getSyncInstanceTaskSpy).toBeCalledTimes(0);
    renderWithRouter(<UpdateSyncTask />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getSyncInstanceTaskSpy).toBeCalledTimes(1);
    expect(getSyncInstanceTaskSpy).toBeCalledWith({ task_id: taskId });
  });

  test('should render error tips when get sync instance is fail', async () => {
    getSyncInstanceTaskSpy.mockImplementation(() =>
      resolveErrorThreeSecond({})
    );
    const { container } = renderWithRouter(<UpdateSyncTask />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.retry'));
    expect(getSyncInstanceTaskSpy).toBeCalledTimes(2);
    expect(getSyncInstanceTaskSpy).toBeCalledWith({ task_id: taskId });
    expect(screen.getByText('common.retry').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.retry').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
  });

  test('should send update request when clicking submit button', async () => {
    const history = createMemoryHistory();
    renderWithServerRouter(<UpdateSyncTask />, undefined, { history });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByLabelText('syncDataSource.syncTaskForm.source')
    ).toBeDisabled();
    expect(
      screen.getByLabelText('syncDataSource.syncTaskForm.instanceType')
    ).toBeDisabled();

    fireEvent.change(
      screen.getByLabelText('syncDataSource.syncTaskForm.version'),
      { target: { value: '3.33' } }
    );

    fireEvent.change(screen.getByLabelText('syncDataSource.syncTaskForm.url'), {
      target: { value: 'http://localhost:3001' },
    });
    expect(updateSyncInstanceTaskSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(updateSyncInstanceTaskSpy).toBeCalledTimes(1);
    expect(updateSyncInstanceTaskSpy).toBeCalledWith({
      task_id: '99',
      global_rule_template: 'global_rule_template_name1',
      sync_instance_interval: '0 0 * * *',
      url: 'http://localhost:3001',
      version: '3.33',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('syncDataSource.updateSyncTask.successTips')
    ).toBeInTheDocument();
    expect(history.location.pathname).toBe('/syncDataSource');

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('syncDataSource.updateSyncTask.successTips')
    ).not.toBeInTheDocument();
  });
});
