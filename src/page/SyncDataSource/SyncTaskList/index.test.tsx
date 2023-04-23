import { fireEvent, screen, act } from '@testing-library/react';
import SyncTaskList from '.';
import { IInstanceTaskResV1 } from '../../../api/common';
import { InstanceTaskResV1LastSyncStatusEnum } from '../../../api/common.enum';
import sync_instance from '../../../api/sync_instance';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import {
  getAllHrefByText,
  getHrefByText,
} from '../../../testUtils/customQuery';

const tableList: IInstanceTaskResV1[] = [
  {
    db_type: 'mysql',
    id: 0,
    last_sync_status: InstanceTaskResV1LastSyncStatusEnum.succeeded,
    last_sync_success_time: '2023-01-10',
    source: 'source1',
    url: 'http://192.168.1.1:3000',
    version: '4.2.2.0',
  },
  {
    db_type: 'oracle',
    id: 1,
    last_sync_status: InstanceTaskResV1LastSyncStatusEnum.failed,
    last_sync_success_time: '2023-01-10',
    source: 'source1',
    url: 'http://192.168.1.1:3000',
    version: '4.2.2.0',
  },
];

describe('test SyncTaskList', () => {
  let getSyncInstanceTaskListSpy: jest.SpyInstance;
  let triggerSyncInstanceSpy: jest.SpyInstance;
  let deleteSyncInstanceTaskSpy: jest.SpyInstance;
  beforeEach(() => {
    getSyncInstanceTaskListSpy = mockGetSyncInstanceTaskList();
    triggerSyncInstanceSpy = mockTriggerSyncInstance();
    deleteSyncInstanceTaskSpy = mockDeleteSyncInstanceTask();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetSyncInstanceTaskList = () => {
    const spy = jest.spyOn(sync_instance, 'GetSyncInstanceTaskList');
    spy.mockImplementation(() => resolveThreeSecond(tableList));
    return spy;
  };
  const mockTriggerSyncInstance = () => {
    const spy = jest.spyOn(sync_instance, 'triggerSyncInstanceV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockDeleteSyncInstanceTask = () => {
    const spy = jest.spyOn(sync_instance, 'deleteSyncInstanceTaskV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', () => {
    const { container } = renderWithRouter(<SyncTaskList />);

    expect(container).toMatchSnapshot();
  });

  test('should be called request to get data for the render table', async () => {
    expect(getSyncInstanceTaskListSpy).toBeCalledTimes(0);
    const { container } = renderWithRouter(<SyncTaskList />);
    expect(getSyncInstanceTaskListSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByTestId('refreshTable'));
    expect(getSyncInstanceTaskListSpy).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
  });

  test('should jump to "/syncDataSource/create" when clicking add sync task button', () => {
    renderWithRouter(<SyncTaskList />);
    expect(getHrefByText('syncDataSource.syncTaskList.addSyncTask')).toBe(
      '/syncDataSource/create'
    );
  });

  test('should jump to "/syncDataSource/update" when clicking edit sync task button', async () => {
    renderWithRouter(<SyncTaskList />);

    await act(() => jest.advanceTimersByTime(3000));

    expect(screen.queryAllByText('common.edit').length).toBe(2);

    fireEvent.click(screen.queryAllByText('common.edit')[0]);
    expect(getAllHrefByText('common.edit')[0]).toBe('/syncDataSource/update/0');
    expect(getAllHrefByText('common.edit')[1]).toBe('/syncDataSource/update/1');
  });

  test('should be send sync request when clicking sync task button', async () => {
    expect(triggerSyncInstanceSpy).toBeCalledTimes(0);
    renderWithRouter(<SyncTaskList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(
      screen.queryAllByText('syncDataSource.syncTaskList.columns.sync')[0]
    );
    expect(triggerSyncInstanceSpy).toBeCalledTimes(1);
    expect(triggerSyncInstanceSpy).toBeCalledWith({
      task_id: '0',
    });
    expect(
      screen.getByText('syncDataSource.syncTaskList.syncTaskLoading')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('syncDataSource.syncTaskList.syncTaskLoading')
    ).not.toBeInTheDocument();

    expect(
      screen.getByText('syncDataSource.syncTaskList.syncTaskSuccessTips')
    ).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('syncDataSource.syncTaskList.syncTaskSuccessTips')
    ).not.toBeInTheDocument();
  });

  test('should be send delete request when clicking delete task button', async () => {
    expect(deleteSyncInstanceTaskSpy).toBeCalledTimes(0);
    renderWithRouter(<SyncTaskList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.queryAllByText('common.delete')[0]);
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('syncDataSource.syncTaskList.columns.deleteConfirmTitle')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.ok'));

    expect(deleteSyncInstanceTaskSpy).toBeCalledTimes(1);
    expect(deleteSyncInstanceTaskSpy).toBeCalledWith({
      task_id: '0',
    });
    expect(
      screen.getByText('syncDataSource.syncTaskList.deleteTaskLoading')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('syncDataSource.syncTaskList.deleteTaskLoading')
    ).not.toBeInTheDocument();

    expect(
      screen.getByText('syncDataSource.syncTaskList.deleteTaskSuccessTips')
    ).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('syncDataSource.syncTaskList.deleteTaskSuccessTips')
    ).not.toBeInTheDocument();
  });
});
