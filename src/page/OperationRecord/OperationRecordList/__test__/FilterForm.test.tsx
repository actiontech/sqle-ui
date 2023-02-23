import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks/dom';
import { useForm } from 'antd/lib/form/Form';
import { getProjectTipsV1FunctionalModuleEnum } from '../../../../api/project/index.enum';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import {
  mockUseOperationActions,
  mockUseOperationTypeName,
  mockUseProject,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import FilterForm from '../FilterForm';

describe('test OperationRecordList/FilterForm', () => {
  const mockUpdateOperationRecordListFilter = jest.fn();

  let getOperationTypeNameListSpy: jest.SpyInstance;
  let getOperationActionsSpy: jest.SpyInstance;
  let getProjectTips: jest.SpyInstance;
  beforeEach(() => {
    getOperationTypeNameListSpy = mockUseOperationTypeName();
    getOperationActionsSpy = mockUseOperationActions();
    getProjectTips = mockUseProject();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { result } = renderHook(() => useForm());
    expect(getOperationTypeNameListSpy).toBeCalledTimes(0);
    expect(getOperationActionsSpy).toBeCalledTimes(0);
    expect(getProjectTips).toBeCalledTimes(0);
    const { container } = render(
      <FilterForm
        form={result.current[0]}
        updateOperationRecordListFilter={mockUpdateOperationRecordListFilter}
      />
    );

    expect(getOperationTypeNameListSpy).toBeCalledTimes(1);
    expect(getOperationActionsSpy).toBeCalledTimes(1);
    expect(getProjectTips).toBeCalledTimes(1);
    expect(getProjectTips).toBeCalledWith({
      functional_module: getProjectTipsV1FunctionalModuleEnum.operation_record,
    });

    expect(container).toMatchSnapshot();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should be call "updateOperationRecordListFilter" when clicking submit button', async () => {
    const { result } = renderHook(() => useForm());

    const { container } = render(
      <FilterForm
        form={result.current[0]}
        updateOperationRecordListFilter={mockUpdateOperationRecordListFilter}
      />
    );

    expect(mockUpdateOperationRecordListFilter).toBeCalledTimes(0);

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
      '操作类型',
      0
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    selectOptionByIndex(
      'operationRecord.list.filterForm.operationAction',
      '操作内容',
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
    expect(mockUpdateOperationRecordListFilter).toBeCalledTimes(1);
    expect(mockUpdateOperationRecordListFilter).toBeCalledWith({
      operationAction: 'operation_action',
      operationType: 'operation_type_name',
      operator: 'admin',
      projectName: 'project_name_1',
    });

    fireEvent.click(screen.getByText('common.reset'));

    expect(mockUpdateOperationRecordListFilter).toBeCalledTimes(2);
    expect(mockUpdateOperationRecordListFilter).toBeCalledWith({});

    expect(
      screen.getByLabelText('operationRecord.list.filterForm.operator')
    ).toHaveValue('');
    expect(container).toMatchSnapshot();
  });

  test('should send empty string when select platform operation', async () => {
    const { result } = renderHook(() => useForm());

    getProjectTips.mockImplementation(() =>
      resolveThreeSecond([{ project_name: '' }])
    );

    render(
      <FilterForm
        form={result.current[0]}
        updateOperationRecordListFilter={mockUpdateOperationRecordListFilter}
      />
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    selectOptionByIndex(
      'operationRecord.list.filterForm.projectName',
      'operationRecord.list.filterForm.platformOperation',
      0
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(mockUpdateOperationRecordListFilter).toBeCalledTimes(1);
    expect(mockUpdateOperationRecordListFilter).toBeCalledWith({
      projectName: '',
    });
  });
});
