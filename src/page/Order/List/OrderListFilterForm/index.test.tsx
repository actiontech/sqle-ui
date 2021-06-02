import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import { isEqual } from 'lodash';
import OrderListFilterForm from '.';
import { getBySelector } from '../../../../testUtils/customQuery';
import {
  mockUseInstance,
  mockUseUsername,
} from '../../../../testUtils/mockRequest';

describe('Order/List', () => {
  let getUserTips: jest.SpyInstance;
  let getInstanceTips: jest.SpyInstance;
  beforeEach(() => {
    getUserTips = mockUseUsername();
    getInstanceTips = mockUseInstance();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('should get select option from request', async () => {
    render(
      <OrderListFilterForm
        form={undefined as any}
        submit={jest.fn()}
        reset={jest.fn()}
      />
    );
    expect(getUserTips).toBeCalledTimes(1);
    expect(getInstanceTips).toBeCalledTimes(1);
  });

  test('should props method of props will be called when click submit or reset button', () => {
    const submitMock = jest.fn();
    const resetMock = jest.fn();
    render(
      <OrderListFilterForm
        form={undefined as any}
        submit={submitMock}
        reset={resetMock}
      />
    );
    expect(screen.getByText('common.search')).toBeInTheDocument();
    expect(screen.getByText('common.reset')).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.search'));
    expect(submitMock).toBeCalledTimes(1);
    fireEvent.click(screen.getByText('common.reset'));
    expect(resetMock).toBeCalledTimes(1);
  });

  test('should toggle collapse when use click the collapse text', async () => {
    const { result } = renderHook(() => useForm());
    const submitMock = jest.fn();
    const resetMock = jest.fn();
    const temp = result.current[0].setFieldsValue;
    const setValueSpy = jest.spyOn(result.current[0], 'setFieldsValue');
    setValueSpy.mockImplementation((val) => {
      temp(val);
    });
    render(
      <OrderListFilterForm
        form={result.current[0]}
        submit={submitMock}
        reset={resetMock}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.expansion')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.expansion'));
    expect(screen.queryByText('common.expansion')).not.toBeInTheDocument();
    expect(screen.getByText('common.collapse')).toBeInTheDocument();

    fireEvent.mouseDown(getBySelector('#filter_current_step_type'));

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    const currentStepTypeOption = screen.getByText(
      'order.workflowStatus.review'
    );
    expect(currentStepTypeOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(currentStepTypeOption);
    expect(result.current[0].getFieldsValue()).toEqual({
      filter_current_step_assignee_user_name: undefined,
      filter_task_status: undefined,
      filter_create_user_name: undefined,
      filter_current_step_type: 'sql_review',
      filter_status: undefined,
      filter_task_instance_name: undefined,
    });

    const assigneeInput = getBySelector(
      '#filter_current_step_assignee_user_name'
    );
    fireEvent.mouseDown(assigneeInput);

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    const usernameOption = screen.getAllByText('user_name1')[1];
    expect(usernameOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(usernameOption);
    expect(result.current[0].getFieldsValue()).toEqual({
      filter_current_step_assignee_user_name: 'user_name1',
      filter_current_step_type: 'sql_review',
    });

    fireEvent.mouseDown(getBySelector('#filter_task_status'));

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    const sqlAuditStateOption = screen.getByText(
      'order.sqlTaskStatus.initialized'
    );
    expect(sqlAuditStateOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(sqlAuditStateOption);
    expect(result.current[0].getFieldsValue()).toEqual({
      filter_current_step_assignee_user_name: 'user_name1',
      filter_task_status: 'initialized',
      filter_create_user_name: undefined,
      filter_current_step_type: 'sql_review',
      filter_status: undefined,
      filter_task_instance_name: undefined,
    });

    fireEvent.mouseDown(getBySelector('#filter_task_instance_name'));

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    const taskInstanceNameOption = screen.getAllByText('instance1')[1];
    expect(taskInstanceNameOption).toHaveClass(
      'ant-select-item-option-content'
    );
    fireEvent.click(taskInstanceNameOption);
    expect(result.current[0].getFieldsValue()).toEqual({
      filter_current_step_assignee_user_name: 'user_name1',
      filter_task_status: 'initialized',
      filter_create_user_name: undefined,
      filter_current_step_type: 'sql_review',
      filter_status: undefined,
      filter_task_instance_name: 'instance1',
    });

    expect(screen.getByText('common.collapse')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.collapse'));
    expect(screen.getByText('common.expansion')).toBeInTheDocument();
    expect(screen.queryByText('common.collapse')).not.toBeInTheDocument();

    expect(result.current[0].getFieldsValue()).toEqual({
      filter_current_step_assignee_user_name: undefined,
      filter_task_status: undefined,
      filter_create_user_name: undefined,
      filter_current_step_type: 'sql_review',
      filter_status: undefined,
      filter_task_instance_name: undefined,
    });

    expect(setValueSpy).toBeCalledTimes(1);
    expect(
      isEqual(setValueSpy.mock.calls[0][0], {
        filter_current_step_assignee_user_name: undefined,
        filter_task_status: undefined,
        filter_task_instance_name: undefined,
        filter_subject: undefined,
        filter_order_createTime: undefined,
      })
    ).toBeTruthy();
    expect(submitMock).toBeCalledTimes(1);
  });

  test('should be control mode will pass collapse props', async () => {
    const submitMock = jest.fn();
    const resetMock = jest.fn();
    const collapseChangeMock = jest.fn();
    const { rerender } = render(
      <OrderListFilterForm
        form={undefined as any}
        submit={submitMock}
        reset={resetMock}
        collapse={true}
        collapseChange={collapseChangeMock}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.expansion')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.expansion'));
    expect(screen.queryByText('common.collapse')).not.toBeInTheDocument();
    expect(screen.getByText('common.expansion')).toBeInTheDocument();
    expect(collapseChangeMock).toBeCalledWith(false);

    const { result } = renderHook(() => useForm());

    rerender(
      <OrderListFilterForm
        form={result.current[0]}
        submit={submitMock}
        reset={resetMock}
        collapse={false}
        collapseChange={collapseChangeMock}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.collapse')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.collapse'));
    expect(screen.queryByText('common.expansion')).not.toBeInTheDocument();
    expect(screen.getByText('common.collapse')).toBeInTheDocument();
    expect(collapseChangeMock).toBeCalledWith(true);
  });
});
