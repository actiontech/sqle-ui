import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IOperationRecordList } from '../../../../api/common';
import { OperationRecordListStatusEnum } from '../../../../api/common.enum';
import OperationRecord from '../../../../api/OperationRecord';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import {
  mockUseOperationActions,
  mockUseOperationTypeName,
  mockUseProject,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import OperationRecordList from '../../index';

const mockList: IOperationRecordList[] = [
  {
    id: 1,
    operation_time: '2023-02-03T17:44:11+08:00',
    operation_user: {
      user_name: 'admin',
      ip: '192.168.1.1',
    },
    operation_type_name: 'type1',
    operation_content: 'content1',
    project_name: 'default',
    status: OperationRecordListStatusEnum.failed,
  },
];

describe('test OperationRecordList', () => {
  let getOperationRecordListSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseOperationTypeName();
    mockUseOperationActions();
    mockUseProject();
    getOperationRecordListSpy = mockGetOperationRecordList();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetOperationRecordList = () => {
    const spy = jest.spyOn(OperationRecord, 'getOperationRecordListV1');
    spy.mockImplementation(() => resolveThreeSecond(mockList));
    return spy;
  };

  test('should match snapshot', async () => {
    expect(getOperationRecordListSpy).toBeCalledTimes(0);
    const { container } = render(<OperationRecordList />);
    expect(getOperationRecordListSpy).toBeCalledTimes(1);
    expect(getOperationRecordListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });

    expect(container).toMatchSnapshot();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should send request when clicking search button', async () => {
    render(<OperationRecordList />);

    expect(getOperationRecordListSpy).toBeCalledTimes(1);
    expect(getOperationRecordListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    selectOptionByIndex(
      'operationRecord.list.filterForm.projectName',
      'project_name_1'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    selectOptionByIndex(
      'operationRecord.list.filterForm.operationType',
      '数据源',
      0
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    selectOptionByIndex(
      'operationRecord.list.filterForm.operationAction',
      '编辑数据源',
      0
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.change(
      screen.getByLabelText('operationRecord.list.filterForm.operator'),
      { target: { value: 'admin' } }
    );

    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(getOperationRecordListSpy).toBeCalledTimes(2);
    expect(getOperationRecordListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      fuzzy_search_operate_user_name: 'admin',
      filter_operate_action: 'edit_instance',
      filter_operate_project_name: 'project_name_1',
      filter_operate_time_from: undefined,
      filter_operate_time_to: undefined,
      filter_operate_type_name: 'instance',
    });

    fireEvent.click(screen.getByText('common.reset'));
    expect(getOperationRecordListSpy).toBeCalledTimes(3);
    expect(getOperationRecordListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
  });

  test('should send request when clicking refresh button', async () => {
    render(<OperationRecordList />);

    expect(getOperationRecordListSpy).toBeCalledTimes(1);
    expect(getOperationRecordListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByTestId('refresh-table'));
    expect(getOperationRecordListSpy).toBeCalledTimes(2);
    expect(getOperationRecordListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
  });
});
