import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import { isEqual } from 'lodash';
import OrderListFilterForm from '.';
import { getBySelector } from '../../../../testUtils/customQuery';
import {
  mockUseInstance,
  mockUseUsername,
} from '../../../../testUtils/mockRequest';

const projectName = 'default';

describe('Order/List/OrderListFilterForm', () => {
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
        projectName={projectName}
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
        projectName={projectName}
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
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.expansion')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.expansion'));
    expect(screen.queryByText('common.expansion')).not.toBeInTheDocument();
    expect(screen.getByText('common.collapse')).toBeInTheDocument();

    expect(result.current[0].getFieldsValue()).toEqual({
      filter_current_step_assignee_user_name: undefined,
      filter_create_user_name: undefined,
      filter_status: undefined,
      filter_task_instance_name: undefined,
      fuzzy_search_workflow_desc: undefined,
    });

    const assigneeInput = getBySelector(
      '#filter_current_step_assignee_user_name'
    );
    fireEvent.mouseDown(assigneeInput);

    await act(() => {
      jest.runOnlyPendingTimers();
    });
    const usernameOption = screen.getAllByText('user_name1')[1];
    expect(usernameOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(usernameOption);
    expect(result.current[0].getFieldsValue()).toEqual({
      filter_current_step_assignee_user_name: 'user_name1',
      // filter_current_step_type: 'sql_review',
    });

    fireEvent.mouseDown(getBySelector('#filter_task_instance_name'));

    await act(() => {
      jest.runOnlyPendingTimers();
    });

    const taskInstanceNameOption = screen.getAllByText('instance1')[1];
    expect(taskInstanceNameOption).toHaveClass(
      'ant-select-item-option-content'
    );
    fireEvent.click(taskInstanceNameOption);

    fireEvent.input(screen.getByLabelText('order.order.id'), {
      target: { value: '1234' },
    });
    fireEvent.input(screen.getByLabelText('order.order.desc'), {
      target: { value: 'desc' },
    });
    expect(result.current[0].getFieldsValue()).toEqual({
      filter_current_step_assignee_user_name: 'user_name1',
      filter_create_user_name: undefined,
      // filter_current_step_type: 'sql_review',
      filter_status: undefined,
      filter_task_instance_name: 'instance1',
      filter_subject: undefined,
      filter_order_createTime: undefined,
      filter_order_executeTime: undefined,
      filter_workflow_id: '1234',
      fuzzy_search_workflow_desc: 'desc',
    });

    expect(screen.getByText('common.collapse')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.collapse'));
    expect(screen.getByText('common.expansion')).toBeInTheDocument();
    expect(screen.queryByText('common.collapse')).not.toBeInTheDocument();

    expect(result.current[0].getFieldsValue()).toEqual({
      filter_current_step_assignee_user_name: undefined,
      filter_create_user_name: undefined,
      // filter_current_step_type: 'sql_review',
      filter_status: undefined,
      filter_task_instance_name: undefined,
      filter_workflow_id: '1234',
    });

    expect(setValueSpy).toBeCalledTimes(1);
    expect(
      isEqual(setValueSpy.mock.calls[0][0], {
        filter_current_step_assignee_user_name: undefined,
        filter_task_instance_name: undefined,
        filter_subject: undefined,
        filter_order_createTime: undefined,
        filter_order_executeTime: undefined,
        fuzzy_search_workflow_desc: undefined,
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
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

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
        projectName={projectName}
      />
    );
    await act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.collapse')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.collapse'));
    expect(screen.queryByText('common.expansion')).not.toBeInTheDocument();
    expect(screen.getByText('common.collapse')).toBeInTheDocument();
    expect(collapseChangeMock).toBeCalledWith(true);
  });
});
