/* eslint-disable no-console */
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
  workflowTasks,
} from './__testData__';
import { screen, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router';
import task from '../../../api/task';
import { act } from 'react-dom/test-utils';
import {
  getAllBySelector,
  getBySelector,
} from '../../../testUtils/customQuery';
import { SupportTheme } from '../../../theme';
import { AuditTaskResV1AuditLevelEnum } from '../../../api/common.enum';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

const projectName = 'default';
const orderId = '1';

describe('Order/Detail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  let getInstanceSummarySpy: jest.SpyInstance;
  const error = console.error;

  beforeEach(() => {
    console.error = jest.fn((message: any) => {
      if (
        message.includes(
          '[antd: Descriptions] Sum of column `span` in a line not match `column` of Descriptions'
        ) ||
        message.includes(
          'A component is changing an uncontrolled input to be controlled'
        )
      ) {
        return;
      }
      error(message);
    });

    useParamsMock.mockReturnValue({ orderId, projectName });
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { username: 'admin', theme: SupportTheme.LIGHT },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => jest.fn());
    mockGetInstanceWorkflowTemplate();
    getInstanceSummarySpy = mockGetSummaryOfInstanceTasks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    console.error = error;
  });

  const mockCancelWorkflow = () => {
    const spy = jest.spyOn(workflow, 'cancelWorkflowV2');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockGetInstanceWorkflowTemplate = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceWorkflowTemplate));
    return spy;
  };

  const mockGetWorkflow = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowV2');
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

  const mockCreateAuditTasksV1 = () => {
    const spy = jest.spyOn(task, 'createAuditTasksV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
      })
    );
    return spy;
  };

  const mockAuditTaskGroupId = () => {
    const spy = jest.spyOn(task, 'auditTaskGroupIdV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfo],
      })
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

  const mockGetSummaryOfInstanceTasks = () => {
    const spy = jest.spyOn(workflow, 'getSummaryOfInstanceTasksV2');
    spy.mockImplementation(() => resolveThreeSecond(workflowTasks));
    return spy;
  };

  test('should render on process order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    const { container } = renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_id: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(order.record?.tasks?.map((v) => v.task_id)),
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should render close order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderCancel));
    const getTaskSpy = mockGetTask();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_id: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderCancel.record?.tasks?.map((v) => v.task_id)),
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('order.closeOrder.button')?.parentNode
    ).toHaveAttribute('hidden');
    expect(screen.getByText('order.status.canceled')).toBeInTheDocument();
  });

  test('should render reject order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_id: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderReject.record?.tasks?.map((v) => v.task_id)),
    });

    expect(screen.getByText('order.closeOrder.button')).toBeInTheDocument();
    expect(screen.getByText('order.status.reject')).toBeInTheDocument();
  });

  test('should render pass order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderPass));
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_id: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderPass.record?.tasks?.map((v) => v.task_id)),
    });
    expect(
      screen.queryByText('order.closeOrder.button')?.parentNode
    ).toHaveAttribute('hidden');
    expect(screen.getAllByText('order.status.finished')[0]).toBeInTheDocument();
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
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_id: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderWithHistory.record?.tasks?.map((v) => v.task_id)),
    });

    expect(screen.getByText('order.closeOrder.button')).toBeInTheDocument();
    expect(screen.getByText('order.history.showHistory')).toBeInTheDocument();
    expect(screen.getByText('order.status.wait_for_audit')).toBeInTheDocument();
  });

  test('should send resolve order request when click resolve button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    mockGetTask();
    mockGetTaskSqls();

    const resolveOrderSpy = jest.spyOn(workflow, 'executeTasksOnWorkflowV2');
    resolveOrderSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.operator.batchSqlExecute')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.operator.batchSqlExecute'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('order.operator.batchSqlExecuteConfirmTips')
    ).toBeInTheDocument();

    expect(screen.getByText('common.ok')).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.ok'));

    expect(resolveOrderSpy).toBeCalledTimes(1);
    expect(resolveOrderSpy).toBeCalledWith({
      workflow_id: order.workflow_id,
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getWorkflowSpy).toBeCalledTimes(2);
    expect(
      screen.getByText('order.operator.executingTips')
    ).toBeInTheDocument();
  });

  test('should send reject order request when click reject button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    mockGetTask();
    mockGetTaskSqls();
    getInstanceSummarySpy.mockImplementation(() =>
      resolveThreeSecond([workflowTasks[0], workflowTasks[1]])
    );
    const rejectOrderSpy = jest.spyOn(workflow, 'rejectWorkflowV2');
    rejectOrderSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(() => {
      fireEvent.click(screen.getByText('order.operator.rejectFull'));
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

    await act(async () => {
      return jest.runOnlyPendingTimers();
    });

    expect(rejectOrderSpy).toBeCalledTimes(1);
    expect(rejectOrderSpy).toBeCalledWith({
      project_name: projectName,
      reason: 'test reason',
      workflow_id: order.workflow_id,
      workflow_step_id: String(
        order.record?.workflow_step_list?.[
          (order.record?.current_step_number ?? 0) - 1
        ].workflow_step_id
      ),
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getWorkflowSpy).toBeCalledTimes(2);
    expect(
      screen.getByText('order.operator.rejectSuccessTips')
    ).toBeInTheDocument();
  });

  test('should get new sql audit result when update audit sql', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));
    mockGetTask();
    mockGetTaskSqls();
    const createAuditTaskSpy = mockCreateAuditTasksV1();
    const auditTaskGroupIdSpy = mockAuditTaskGroupId();
    const getSqlContentSpy = mockGetSqlContent();
    const { container } = renderWithThemeAndRouter(<Order />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.operator.modifySql'));
    expect(screen.getByText('order.modifySql.title')).toBeInTheDocument();
    expect(getSqlContentSpy).toBeCalledTimes(1);
    expect(getSqlContentSpy).toBeCalledWith({
      task_id: String(taskInfo.task_id),
    });
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue(
      '/* input your sql */'
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue('old sql');
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'new sql' },
    });
    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(createAuditTaskSpy).toBeCalledWith({
      instances: [{ instance_name: 'db1', instance_schema: '' }],
      project_name: projectName,
    });
    expect(auditTaskGroupIdSpy).toBeCalledTimes(0);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(auditTaskGroupIdSpy).toBeCalledTimes(1);

    expect(auditTaskGroupIdSpy).toBeCalledWith({
      task_group_id: 11,
      sql: 'new sql',
    });

    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should update order when click update order button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));

    const workflowUpdateSpy = jest.spyOn(workflow, 'updateWorkflowV2');
    workflowUpdateSpy.mockImplementation(() => resolveThreeSecond({}));
    mockCreateAuditTasksV1();
    mockAuditTaskGroupId();
    mockGetTask();
    mockGetTaskSqls();
    mockGetSqlContent();
    const { container } = renderWithThemeAndRouter(<Order />);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(screen.getByText('order.modifySql.updateOrder')).toBeInTheDocument();
    expect(
      screen.getByText('order.modifySql.giveUpUpdate')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.modifySql.updateOrder'));
    await act(async () => {
      return jest.runOnlyPendingTimers();
    });
    fireEvent.click(screen.getByText('OK'));
    expect(workflowUpdateSpy).toBeCalledTimes(1);
    expect(workflowUpdateSpy).toBeCalledWith({
      task_ids: [27],
      workflow_id: orderReject.workflow_id,
      project_name: projectName,
    });
    expect(screen.getByText('order.modifySql.updateOrder')).toBeInTheDocument();
    expect(
      screen.getByText('order.modifySql.updateOrder').parentNode
    ).toHaveClass('ant-btn-loading');
    await act(async () => jest.advanceTimersByTime(3000));

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
    mockCreateAuditTasksV1();
    mockAuditTaskGroupId();
    mockGetTask();
    mockGetTaskSqls();
    mockGetSqlContent();
    renderWithThemeAndRouter(<Order />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('order.modifySql.updateOrder')).toBeInTheDocument();
    expect(
      screen.getByText('order.modifySql.giveUpUpdate')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.modifySql.giveUpUpdate'));
    await act(async () => {
      return jest.runOnlyPendingTimers();
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

    const workflowUpdateSpy = jest.spyOn(workflow, 'updateWorkflowV2');
    workflowUpdateSpy.mockImplementation(() => resolveThreeSecond({}));

    mockCreateAuditTasksV1();
    const auditTaskGroupIdSpy = mockAuditTaskGroupId();
    auditTaskGroupIdSpy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfoErrorAuditLevel],
      })
    );
    mockGetTask();
    mockGetTaskSqls();
    mockGetSqlContent();
    renderWithThemeAndRouter(<Order />);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.modifySql.updateOrder').closest('button')
    ).toBeDisabled();

    auditTaskGroupIdSpy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfo],
      })
    );

    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.modifySql.updateOrder').closest('button')
    ).not.toBeDisabled();
  });

  test('should can not update order when submit sql is empty', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));

    const workflowUpdateSpy = jest.spyOn(workflow, 'updateWorkflowV2');
    workflowUpdateSpy.mockImplementation(() => resolveThreeSecond({}));

    mockGetTask();
    mockAuditTaskGroupId();
    mockCreateTask();
    mockCreateAuditTasksV1();
    const getSqlSpy = mockGetTaskSqls();
    getSqlSpy.mockImplementation(() =>
      resolveThreeSecond(taskSqls, { otherData: { total_nums: 0 } })
    );
    mockGetSqlContent();
    renderWithThemeAndRouter(<Order />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.operator.modifySql'));
    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.modifySql.updateOrder'));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('OK'));
    expect(workflowUpdateSpy).toBeCalledTimes(0);
    expect(
      screen.getByText('order.modifySql.updateEmptyOrderTips')
    ).toBeInTheDocument();
  });

  test('should be called cancel workflow request when clicked close order button', async () => {
    let cancelWorkflowSpy = mockCancelWorkflow();
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));
    mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.closeOrder.button'));
    expect(
      screen.getByText('order.closeOrder.closeConfirm')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.ok'));
    expect(cancelWorkflowSpy).toBeCalledTimes(1);
    expect(cancelWorkflowSpy).toBeCalledWith({
      project_name: projectName,
      workflow_id: orderReject.workflow_id,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.closeOrder.closeOrderSuccessTips')
    ).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('order.closeOrder.closeOrderSuccessTips')
    ).not.toBeInTheDocument();
  });
});
