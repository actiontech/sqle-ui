import { fireEvent, screen, waitFor } from '@testing-library/react';
import AddSyncTask from '.';
import sync_instance from '../../../api/sync_instance';
import EmitterKey from '../../../data/EmitterKey';
import { selectOptionByIndex } from '../../../testUtils/customQuery';
import { renderWithRouter } from '../../../testUtils/customRender';
import {
  mockDriver,
  mockUseGlobalRuleTemplate,
  mockUseTaskSource,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';

describe('test AddSyncTask', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockDriver();
    mockUseTaskSource();
    mockUseGlobalRuleTemplate();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockCreateSyncInstanceTask = () => {
    const spy = jest.spyOn(sync_instance, 'createSyncInstanceTaskV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = renderWithRouter(<AddSyncTask />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should send request when clicking submit button', async () => {
    const createSyncInstanceTaskSpy = mockCreateSyncInstanceTask();
    const { baseElement } = renderWithRouter(<AddSyncTask />);
    expect(createSyncInstanceTaskSpy).toBeCalledTimes(0);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    selectOptionByIndex('syncDataSource.syncTaskForm.source', 'source1');
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.change(
      screen.getByLabelText('syncDataSource.syncTaskForm.version'),
      { target: { value: '4.22.0' } }
    );
    fireEvent.change(screen.getByLabelText('syncDataSource.syncTaskForm.url'), {
      target: { value: 'http://192.168.0.1:3000' },
    });

    selectOptionByIndex('syncDataSource.syncTaskForm.instanceType', 'mysql');
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    selectOptionByIndex(
      'syncDataSource.syncTaskForm.ruleTemplateName',
      'global_rule_template_name1'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(createSyncInstanceTaskSpy).toBeCalledTimes(1);
    expect(createSyncInstanceTaskSpy).toBeCalledWith({
      db_type: 'mysql',
      global_rule_template: 'global_rule_template_name1',
      source: 'source1',
      sync_instance_interval: '0 0 * * *',
      url: 'http://192.168.0.1:3000',
      version: '4.22.0',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.getByText('syncDataSource.addSyncTask.successTips')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    expect(emitSpy).toBeCalledTimes(0);
    fireEvent.click(screen.getByText('common.resetAndClose'));

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(
      EmitterKey.Refresh_Sync_Task_Rule_Template_Tips
    );
    expect(baseElement).toMatchSnapshot();
  });
});
