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
import { AuditTaskResV1AuditLevelEnum } from '../../../api/common.enum';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
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
    mockUseSelector({ user: { username: 'admin', theme: SupportTheme.LIGHT } });
    mockUseDispatch();
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

  const mockGetInstanceWorkflowTemplate = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
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
    const spy = jest.spyOn(workflow, 'getSummaryOfInstanceTasksV1');
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
      workflow_name: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(order.record?.tasks?.map((v) => v.task_id)),
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });

  test('should render close order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderCancel));
    const getTaskSpy = mockGetTask();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_name: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderCancel.record?.tasks?.map((v) => v.task_id)),
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
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
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_name: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderReject.record?.tasks?.map((v) => v.task_id)),
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
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_name: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderPass.record?.tasks?.map((v) => v.task_id)),
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
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_name: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderWithHistory.record?.tasks?.map((v) => v.task_id)),
    });

    expect(screen.queryByText('order.closeOrder.button')).toBeInTheDocument();
    expect(screen.queryByText('order.history.showHistory')).toBeInTheDocument();
    expect(
      screen.queryByText('order.status.wait_for_audit')
    ).toBeInTheDocument();
  });

  test('should send resolve order request when click resolve button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    mockGetTask();
    mockGetTaskSqls();

    const resolveOrderSpy = jest.spyOn(workflow, 'executeTasksOnWorkflowV1');
    resolveOrderSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('order.operator.batchSqlExecute')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.operator.batchSqlExecute'));
    expect(resolveOrderSpy).toBeCalledTimes(1);
    expect(resolveOrderSpy).toBeCalledWith({
      workflow_name: order.workflow_name,
      project_name: projectName,
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
    getInstanceSummarySpy.mockImplementation(() =>
      resolveThreeSecond([workflowTasks[0], workflowTasks[1]])
    );
    const rejectOrderSpy = jest.spyOn(workflow, 'rejectWorkflowV1');
    rejectOrderSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
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

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    expect(rejectOrderSpy).toBeCalledTimes(1);
    expect(rejectOrderSpy).toBeCalledWith({
      project_name: projectName,
      reason: 'test reason',
      workflow_name: order.workflow_name,
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
    mockGetTaskSqls();
    const createAuditTaskSpy = mockCreateAuditTasksV1();
    const auditTaskGroupIdSpy = mockAuditTaskGroupId();
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
    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(createAuditTaskSpy).toBeCalledWith({
      instances: [{ instance_name: 'db1', instance_schema: '' }],
      project_name: projectName,
    });
    expect(auditTaskGroupIdSpy).toBeCalledTimes(0);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(auditTaskGroupIdSpy).toBeCalledTimes(1);

    expect(auditTaskGroupIdSpy).toBeCalledWith({
      task_group_id: 11,
      sql: 'new sql',
    });

    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

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
    mockCreateAuditTasksV1();
    mockAuditTaskGroupId();
    mockGetTask();
    mockGetTaskSqls();
    mockGetSqlContent();
    const { container } = renderWithThemeAndRouter(<Order />);
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
    expect(container).toMatchSnapshot();
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
      task_ids: [27],
      workflow_name: orderReject.workflow_name,
      project_name: projectName,
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
    mockCreateAuditTasksV1();
    mockAuditTaskGroupId();
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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.modifySql.updateOrder').closest('button')
    ).not.toBeDisabled();
  });

  test('should can not update order when submit sql is empty', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));

    const workflowUpdateSpy = jest.spyOn(workflow, 'updateWorkflowV1');
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
