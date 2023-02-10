import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getProjectTipsV1FunctionalModuleEnum } from '../../../../api/project/index.enum';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import {
  mockUseOperationActions,
  mockUseOperationTypeName,
  mockUseProject,
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
    expect(getOperationTypeNameListSpy).toBeCalledTimes(0);
    expect(getOperationActionsSpy).toBeCalledTimes(0);
    expect(getProjectTips).toBeCalledTimes(0);
    const { container } = render(
      <FilterForm
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
    const { container } = render(
      <FilterForm
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
});
