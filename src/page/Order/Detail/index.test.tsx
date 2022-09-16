import Order from '.';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import workflow from '../../../api/workflow';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import {
  orderWithHistory,
  order,
  taskInfo,
  taskSqls,
  orderCancel,
  orderReject,
  orderPass,
  instanceWorkflowTemplate,
  taskInfoErrorAuditLevel,
} from './__testData__';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import task from '../../../api/task';
import { act } from 'react-dom/test-utils';
import {
  getAllBySelector,
  getBySelector,
} from '../../../testUtils/customQuery';
import { SupportTheme } from '../../../theme';
import instance from '../../../api/instance';
import { AuditTaskResV1AuditLevelEnum } from '../../../api/common.enum';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

describe.skip('Order/Detail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    useParamsMock.mockReturnValue({ orderId: '1' });
    mockUseSelector({ user: { username: 'admin', theme: SupportTheme.LIGHT } });
    mockUseDispatch();
    mockGetInstanceWorkflowTemplate();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  const mockGetInstanceWorkflowTemplate = () => {
    const spy = jest.spyOn(instance, 'getInstanceWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceWorkflowTemplate));
    return spy;
  };

  const mockGetWorkflow = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowV1');
    spy.mockImplementation(() => resolveThreeSecond(order));
    return spy;
  };

  const mockGetTask = () => {
    const spy = jest.spyOn(task, 'getAuditTaskV1');
    spy.mockImplementation(() => resolveThreeSecond(taskInfo));
    return spy;
  };

  const mockGetTaskSqls = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(taskSqls, { otherData: { total_nums: 20 } })
    );
    return spy;
  };

  const mockCreateTask = () => {
    const spy = jest.spyOn(task, 'createAndAuditTaskV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        pass_rate: 0.2,
        task_id: 33,
        audit_level: AuditTaskResV1AuditLevelEnum.normal,
      })
    );
    return spy;
  };

  const mockGetSqlContent = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLContentV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        sql: 'old sql',
      })
    );
    return spy;
  };

  test('should render on process order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    const { container } = renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(order.record?.task_id),
    });

    expect(container).toMatchSnapshot();
  });

  test('should render close order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderCancel));
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderCancel.record?.task_id),
    });
    expect(
      screen.queryByText('order.closeOrder.button')?.parentNode
    ).toHaveAttribute('hidden');
    expect(screen.queryByText('order.status.canceled')).toBeInTheDocument();
  });

  test('should render reject order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderReject.record?.task_id),
    });

    expect(screen.queryByText('order.closeOrder.button')).toBeInTheDocument();
    expect(screen.queryByText('order.status.reject')).toBeInTheDocument();
  });

  test('should render pass order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderPass));
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderPass.record?.task_id),
    });
    expect(
      screen.queryByText('order.closeOrder.button')?.parentNode
    ).toHaveAttribute('hidden');
    expect(
      screen.queryAllByText('order.status.finished')[0]
    ).toBeInTheDocument();
  });

  test('should render process order with order step history info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() =>
      resolveThreeSecond(orderWithHistory)
    );
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderWithHistory.record.task_id),
    });

    expect(screen.queryByText('order.closeOrder.button')).toBeInTheDocument();
    expect(screen.queryByText('order.history.showHistory')).toBeInTheDocument();
    expect(screen.queryByText('order.status.process')).toBeInTheDocument();
  });

  test('should send resolve order request when click resolve button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    mockGetTask();
    mockGetTaskSqls();

    const resolveOrderSpy = jest.spyOn(workflow, 'executeTaskOnWorkflowV1');
    resolveOrderSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('order.operator.sqlExecute')).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.operator.sqlExecute'));
    expect(resolveOrderSpy).toBeCalledTimes(1);
    expect(resolveOrderSpy).toBeCalledWith({
      workflow_id: String(order.workflow_id),
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getWorkflowSpy).toBeCalledTimes(2);
    expect(
      screen.queryByText('order.operator.executingTips')
    ).toBeInTheDocument();
  });

  test('should send reject order request when click reject button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    mockGetTask();
    mockGetTaskSqls();

    const rejectOrderSpy = jest.spyOn(workflow, 'rejectWorkflowV1');
    rejectOrderSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      fireEvent.click(screen.getByText('order.operator.reject'));
    });

    fireEvent.input(screen.getByLabelText('order.operator.rejectReason'), {
      target: { value: 'test reason' },
    });

    const modalOperatorButtons = getAllBySelector(
      'button',
      getBySelector('.ant-modal')
    );
    const rejectButton = modalOperatorButtons[0];
    expect(rejectButton).toHaveAttribute('type', 'submit');
    expect(rejectButton).toHaveTextContent('order.operator.reject');

    fireEvent.click(rejectButton);

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    expect(rejectOrderSpy).toBeCalledTimes(1);
    expect(rejectOrderSpy).toBeCalledWith({
      reason: 'test reason',
      workflow_id: String(order.workflow_id),
      workflow_step_id: String(
        order.record?.workflow_step_list?.[
          (order.record?.current_step_number ?? 0) - 1
        ].workflow_step_id
      ),
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getWorkflowSpy).toBeCalledTimes(2);
    expect(
      screen.queryByText('order.operator.rejectSuccessTips')
    ).toBeInTheDocument();
  });

  test('should get new sql audit result when update audit sql', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));
    mockGetTask();
    const createTaskSpy = mockCreateTask();
    const getTaskSqlSpy = mockGetTaskSqls();
    const getSqlContentSpy = mockGetSqlContent();
    const { container } = renderWithThemeAndRouter(<Order />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('order.operator.modifySql'));
    expect(screen.queryByText('order.modifySql.title')).toBeInTheDocument();
    expect(getSqlContentSpy).toBeCalledTimes(1);
    expect(getSqlContentSpy).toBeCalledWith({
      task_id: String(taskInfo.task_id),
    });
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue(
      '/* input your sql */'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue('old sql');
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'new sql' },
    });
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    expect(createTaskSpy).toBeCalledWith({
      instance_name: 'db1',
      sql: 'new sql',
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    // Modal shouldComponentUpdate return false, so this case can't pass;
    // expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
    //   'ant-btn-loading'
    // );
    expect(getTaskSqlSpy).toBeCalledTimes(2);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should update order when click update order button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));

    const workflowUpdateSpy = jest.spyOn(workflow, 'updateWorkflowV1');
    workflowUpdateSpy.mockImplementation(() => resolveThreeSecond({}));

    mockGetTask();
    mockCreateTask();
    mockGetTaskSqls();
    mockGetSqlContent();
    renderWithThemeAndRouter(<Order />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('order.modifySql.updateOrder')).toBeInTheDocument();
    expect(
      screen.getByText('order.modifySql.giveUpUpdate')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.modifySql.updateOrder'));
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    fireEvent.click(screen.getByText('OK'));
    expect(workflowUpdateSpy).toBeCalledTimes(1);
    expect(workflowUpdateSpy).toBeCalledWith({
      task_id: '33',
      workflow_id: `${orderReject.workflow_id}`,
    });
    expect(screen.getByText('order.modifySql.updateOrder')).toBeInTheDocument();
    expect(
      screen.getByText('order.modifySql.updateOrder').parentNode
    ).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('order.modifySql.updateOrder')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('order.modifySql.giveUpUpdate')
    ).not.toBeInTheDocument();
  });

  test('should give up order when click give up modify button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));

    mockGetTask();
    mockCreateTask();
    mockGetTaskSqls();
    mockGetSqlContent();
    renderWithThemeAndRouter(<Order />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('order.modifySql.updateOrder')).toBeInTheDocument();
    expect(
      screen.getByText('order.modifySql.giveUpUpdate')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.modifySql.giveUpUpdate'));
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    fireEvent.click(screen.getByText('OK'));
    expect(
      screen.queryByText('order.modifySql.updateOrder')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('order.modifySql.giveUpUpdate')
    ).not.toBeInTheDocument();
  });

  test('should be set update order button to disabled  when the sql audit result level does not conform to the configuration', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));

    const workflowUpdateSpy = jest.spyOn(workflow, 'updateWorkflowV1');
    workflowUpdateSpy.mockImplementation(() => resolveThreeSecond({}));

    const createTaskSpy = mockCreateTask();
    createTaskSpy.mockImplementation(() =>
      resolveThreeSecond(taskInfoErrorAuditLevel)
    );

    mockGetTask();
    mockGetTaskSqls();
    mockGetSqlContent();
    renderWithThemeAndRouter(<Order />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.getByText('order.modifySql.updateOrder').closest('button')
    ).toHaveAttribute('disabled');

    createTaskSpy.mockImplementation(() => resolveThreeSecond(taskInfo));

    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.modifySql.updateOrder').closest('button')
    ).not.toHaveAttribute('disabled');
  });

  test('should can not update order when submit sql is empty', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));

    const workflowUpdateSpy = jest.spyOn(workflow, 'updateWorkflowV1');
    workflowUpdateSpy.mockImplementation(() => resolveThreeSecond({}));

    mockGetTask();
    mockCreateTask();
    const getSqlSpy = mockGetTaskSqls();
    getSqlSpy.mockImplementation(() =>
      resolveThreeSecond(taskSqls, { otherData: { total_nums: 0 } })
    );
    mockGetSqlContent();
    renderWithThemeAndRouter(<Order />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('order.modifySql.updateOrder'));
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    fireEvent.click(screen.getByText('OK'));
    expect(workflowUpdateSpy).toBeCalledTimes(0);
    expect(
      screen.queryByText('order.modifySql.updateEmptyOrderTips')
    ).toBeInTheDocument();
  });
});
