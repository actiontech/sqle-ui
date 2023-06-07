import { act, fireEvent, render, screen } from '@testing-library/react';
import { message } from 'antd';
import {
  IAuditTaskResV1,
  IGetWorkflowTasksItemV2,
} from '../../../../api/common';
import {
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum,
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowRecordResV2StatusEnum,
} from '../../../../api/common.enum';
import task from '../../../../api/task';
import workflow from '../../../../api/workflow';
import {
  getAllBySelector,
  getBySelector,
} from '../../../../testUtils/customQuery';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { mockGetAllRules } from '../../../Rule/__test__/utils';
import { taskSqls, workflowTasks } from '../../Detail/__testData__';
import AuditResultCollection from '../AuditResultCollection';
import { useSelector } from 'react-redux';
import { mockUseStyle } from '../../../../testUtils/mockStyle';
const OVERVIEW_TAB_KEY = 'OVERVIEW_TAB_KEY';
const projectName = 'default';
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});
const taskInfos: IAuditTaskResV1[] = [
  {
    task_id: 27,
    instance_name: 'mysql-1',
    instance_schema: 'db1',
    pass_rate: 0.3099,
    status: AuditTaskResV1StatusEnum.audited,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    audit_level: AuditTaskResV1AuditLevelEnum.normal,
    score: 30,
  },
  {
    task_id: 28,
    instance_name: 'mysql-2',
    instance_schema: '',
    pass_rate: 0,
    status: AuditTaskResV1StatusEnum.audited,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    audit_level: AuditTaskResV1AuditLevelEnum.normal,
    score: 30,
  },
];

const workflowTasksNotAssigneeUserName: IGetWorkflowTasksItemV2[] = [
  {
    current_step_assignee_user_name_list: ['admin1'],
    exec_end_time: '2022-09-30',
    exec_start_time: '2022-09-01',
    instance_name: 'mysql-1',
    status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
    task_id: 27,
    task_pass_rate: 0.3099,
    task_score: 30,
  },
];

const activeKey = taskInfos[0].task_id?.toString()!;
const workflowId = '22';

describe('test AuditResultCollection', () => {
  const mockSetAuditResultActiveKey = jest.fn();
  const mockRefreshOrder = jest.fn();
  beforeEach(() => {
    mockUseStyle();
    mockGetAllRules();
    mockGetTaskSqls();
    mockUpdateTaskSqlDesc();
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { username: 'admin' },
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  const mockSuccessMessage = () => {
    const spy = jest.spyOn(message, 'success');
    return spy;
  };

  const mockGetTaskSqls = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV2');
    spy.mockImplementation(() =>
      resolveThreeSecond(taskSqls, { otherData: { total_nums: 20 } })
    );
    return spy;
  };
  const mockUpdateTaskSqlDesc = () => {
    const spy = jest.spyOn(task, 'updateAuditTaskSQLsV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };
  const mockGetSummaryOfInstanceTasks = () => {
    const spy = jest.spyOn(workflow, 'getSummaryOfInstanceTasksV2');
    spy.mockImplementation(() => resolveThreeSecond(workflowTasks));
    return spy;
  };

  const mockFailedGetSummaryOfInstanceTasks = () => {
    const spy = jest.spyOn(workflow, 'getSummaryOfInstanceTasksV2');
    spy.mockImplementation(() => resolveErrorThreeSecond({}));
    return spy;
  };

  const mockNotAssigneeUsernameInstanceTasks = () => {
    const spy = jest.spyOn(workflow, 'getSummaryOfInstanceTasksV2');
    spy.mockImplementation(() =>
      resolveThreeSecond(workflowTasksNotAssigneeUserName)
    );
    return spy;
  };

  const mockExecuteOneTaskOnWorkflow = () => {
    const spy = jest.spyOn(workflow, 'executeOneTaskOnWorkflowV2');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockUpdateWorkflowSchedule = () => {
    const spy = jest.spyOn(workflow, 'updateWorkflowScheduleV2');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockTerminateSingleTaskByWorkflow = () => {
    const spy = jest.spyOn(workflow, 'terminateSingleTaskByWorkflowV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot when showOverview is equal false', () => {
    const { container } = render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={activeKey}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        projectName={projectName}
      />
    );

    expect(container).toMatchSnapshot();
  });

  test('should called setAuditResultActiveKey when changing tab', () => {
    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={activeKey}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        projectName={projectName}
      />
    );

    expect(mockSetAuditResultActiveKey).toBeCalledTimes(0);
    expect(screen.getByText(taskInfos[0].instance_name!)).toBeInTheDocument();
    expect(screen.getByText(taskInfos[1].instance_name!)).toBeInTheDocument();
    fireEvent.click(screen.getByText(taskInfos[1].instance_name!));
    expect(mockSetAuditResultActiveKey).toBeCalledTimes(1);
    expect(mockSetAuditResultActiveKey).toBeCalledWith(
      taskInfos[1].task_id?.toString()
    );
  });

  test('should be show overview tab when showOverview is equal true', async () => {
    const { container } = render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={activeKey}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.auditResultCollection.overview')
    ).toBeInTheDocument();
    expect(mockSetAuditResultActiveKey).toBeCalledTimes(1);
    expect(mockSetAuditResultActiveKey).toBeCalledWith(OVERVIEW_TAB_KEY);
    expect(container).toMatchSnapshot();
  });

  test('should be show overview table when showOverview is equal true and workflow_id is not undefined', async () => {
    const getSummaryOfInstanceTasks = mockGetSummaryOfInstanceTasks();
    expect(getSummaryOfInstanceTasks).toBeCalledTimes(0);
    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={activeKey}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        projectName={projectName}
      />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSummaryOfInstanceTasks).toBeCalledTimes(1);
    expect(getSummaryOfInstanceTasks).toBeCalledWith({
      workflow_id: workflowId,
      project_name: projectName,
    });
  });

  test('should match snapshot when getSummaryOfInstanceTasks status was failed', async () => {
    mockFailedGetSummaryOfInstanceTasks();
    const { container } = render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={activeKey}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        projectName={projectName}
      />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should be disabled executed when the order status is rejected or canceled', async () => {
    mockGetSummaryOfInstanceTasks();
    const { rerender } = render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        orderStatus={WorkflowRecordResV2StatusEnum.rejected}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryAllByText('order.auditResultCollection.table.sqlExecute')
        .length
    ).toBe(
      workflowTasks.filter(
        (v) => v.status !== GetWorkflowTasksItemV2StatusEnum.executing
      ).length
    );

    expect(
      screen.queryAllByText('order.auditResultCollection.table.scheduleTime')
        .length
    ).toBe(
      workflowTasks.filter(
        (v) =>
          v.status !== GetWorkflowTasksItemV2StatusEnum.exec_scheduled &&
          v.status !== GetWorkflowTasksItemV2StatusEnum.executing
      ).length
    );

    expect(
      screen.queryAllByText(
        'order.auditResultCollection.table.cancelExecScheduled'
      ).length
    ).toBe(
      workflowTasks.filter(
        (v) => v.status === GetWorkflowTasksItemV2StatusEnum.exec_scheduled
      ).length
    );

    expect(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[0]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[1]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText('order.auditResultCollection.table.scheduleTime')[0]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText('order.auditResultCollection.table.scheduleTime')[1]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText(
        'order.auditResultCollection.table.cancelExecScheduled'
      )[0]
    ).toHaveClass('ant-typography-disabled');

    rerender(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        orderStatus={WorkflowRecordResV2StatusEnum.canceled}
        projectName={projectName}
      />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[0]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[1]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText('order.auditResultCollection.table.scheduleTime')[0]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText('order.auditResultCollection.table.scheduleTime')[1]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText(
        'order.auditResultCollection.table.cancelExecScheduled'
      )[0]
    ).toHaveClass('ant-typography-disabled');
  });

  test('should called execute task request when clicking execute sql button', async () => {
    const getSummaryOfInstanceTasks = mockGetSummaryOfInstanceTasks();
    const mockExecuteTask = mockExecuteOneTaskOnWorkflow();
    const successMessageSyp = mockSuccessMessage();

    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        refreshOrder={mockRefreshOrder}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockExecuteTask).toBeCalledTimes(0);
    expect(mockRefreshOrder).toBeCalledTimes(0);

    expect(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[0]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[1]
    ).not.toHaveClass('ant-typography-disabled');
    fireEvent.click(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[1]
    );

    expect(screen.getByText('common.ok')).toBeInTheDocument();
    expect(
      screen.getByText(
        'order.auditResultCollection.table.sqlExecuteConfirmTips'
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.ok'));

    expect(mockExecuteTask).toBeCalledTimes(1);
    expect(mockExecuteTask).toBeCalledWith({
      workflow_id: workflowId,
      task_id: taskInfos[1].task_id?.toString(),
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(successMessageSyp).toBeCalledTimes(1);
    expect(successMessageSyp).toBeCalledWith('order.status.finished');
    expect(getSummaryOfInstanceTasks).toBeCalledTimes(2);
    expect(mockRefreshOrder).toBeCalledTimes(1);
  });

  test('should called terminate task request when clicking terminate sql button', async () => {
    const getSummaryOfInstanceTasks = mockGetSummaryOfInstanceTasks();
    const mockTerminateSingleTask = mockTerminateSingleTaskByWorkflow();
    const successMessageSyp = mockSuccessMessage();

    getSummaryOfInstanceTasks.mockImplementation(() =>
      resolveThreeSecond([
        ...workflowTasks,
        {
          ...workflowTasks[3],
          task_id: workflowTasks[3].task_id! + 1,
          current_step_assignee_user_name_list: ['user1'],
        },
      ])
    );

    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        refreshOrder={mockRefreshOrder}
        projectName={projectName}
      />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockTerminateSingleTask).toBeCalledTimes(0);
    expect(mockRefreshOrder).toBeCalledTimes(0);
    expect(screen.getAllByText('order.operator.terminate')).toHaveLength(2);
    expect(screen.getAllByText('order.operator.terminate')[0]).not.toHaveClass(
      'ant-typography-disabled'
    );
    expect(screen.getAllByText('order.operator.terminate')[1]).toHaveClass(
      'ant-typography-disabled'
    );
    fireEvent.click(screen.getAllByText('order.operator.terminate')[0]);

    expect(screen.getByText('common.ok')).toBeInTheDocument();
    expect(
      screen.getByText('order.operator.terminateConfirmTips')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.ok'));

    expect(mockTerminateSingleTask).toBeCalledTimes(1);
    expect(mockTerminateSingleTask).nthCalledWith(1, {
      workflow_id: workflowId,
      task_id: workflowTasks[3].task_id?.toString(),
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(successMessageSyp).toBeCalledTimes(1);
    expect(successMessageSyp).toBeCalledWith(
      'order.operator.terminateSuccessTips'
    );
    expect(getSummaryOfInstanceTasks).toBeCalledTimes(2);
    expect(mockRefreshOrder).toBeCalledTimes(1);
  });

  test('should open set schedule time modal task when clicking schedule time button', async () => {
    mockGetSummaryOfInstanceTasks();

    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        refreshOrder={mockRefreshOrder}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getAllByText('order.auditResultCollection.table.scheduleTime')[0]
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getAllByText('order.auditResultCollection.table.scheduleTime')[0]
    );
    await act(async () => {
      return jest.runOnlyPendingTimers();
    });
    expect(getBySelector('.ant-modal')).toBeInTheDocument();
  });

  test('should called updateWorkflowScheduleV1 when clicking cancel execute schedule button', async () => {
    const getSummaryOfInstanceTasks = mockGetSummaryOfInstanceTasks();
    const mockUpdateWorkflow = mockUpdateWorkflowSchedule();
    const successMessageSyp = mockSuccessMessage();

    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        refreshOrder={mockRefreshOrder}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockUpdateWorkflow).toBeCalledTimes(0);

    expect(
      screen.getAllByText(
        'order.auditResultCollection.table.cancelExecScheduled'
      )[0]
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getAllByText(
        'order.auditResultCollection.table.cancelExecScheduled'
      )[0]
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockUpdateWorkflow).toBeCalledTimes(1);
    expect(mockUpdateWorkflow).toBeCalledWith({
      project_name: projectName,
      workflow_id: workflowId,
      task_id: workflowTasks[2].task_id?.toString(),
    });
    expect(successMessageSyp).toBeCalledWith(
      'order.auditResultCollection.table.cancelExecScheduledTips'
    );
    expect(getSummaryOfInstanceTasks).toBeCalledTimes(2);
    expect(mockRefreshOrder).toBeCalledTimes(1);
  });

  test('should call getOverviewListSuccessHandle props when setCanRejectOrder is not undefined and status exists can not reject', async () => {
    mockGetSummaryOfInstanceTasks();
    const mockGetOverviewListSuccessHandle = jest.fn();
    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        refreshOrder={mockRefreshOrder}
        getOverviewListSuccessHandle={mockGetOverviewListSuccessHandle}
        projectName={projectName}
      />
    );
    expect(mockGetOverviewListSuccessHandle).toBeCalledTimes(0);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockGetOverviewListSuccessHandle).toBeCalledTimes(1);
  });

  test('should disabled button when current step assignee user name list is not exists current user name', async () => {
    mockNotAssigneeUsernameInstanceTasks();
    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        projectName={projectName}
      />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[0]
    ).toHaveClass('ant-typography-disabled');
    expect(
      screen.getAllByText('order.auditResultCollection.table.scheduleTime')[0]
    ).toHaveClass('ant-typography-disabled');
  });

  test('should disable execute sql button when the current time is outside the maintenance time', async () => {
    const RealDate = Date.now;

    global.Date.now = jest.fn(() =>
      new Date('2022-09-29T23:40:02+08:00').getTime()
    );

    const getSummarySpy = mockGetSummaryOfInstanceTasks();
    getSummarySpy.mockImplementation(() =>
      resolveThreeSecond([workflowTasks[1]])
    );
    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        workflowId={workflowId}
        refreshOrder={mockRefreshOrder}
        projectName={projectName}
      />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[0]
    ).toHaveClass('ant-typography-disabled');

    global.Date.now = RealDate;
  });

  test('should jump to the corresponding order tab when clicking on overview table row', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { username: 'test' },
      })
    );
    mockGetSummaryOfInstanceTasks();
    const { container } = render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={OVERVIEW_TAB_KEY}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
        projectName={projectName}
        workflowId={workflowId}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockSetAuditResultActiveKey).toBeCalledTimes(1);
    expect(mockSetAuditResultActiveKey).toBeCalledWith(OVERVIEW_TAB_KEY);

    expect(container).toMatchSnapshot();

    fireEvent.click(getAllBySelector('.ant-table-row')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(mockSetAuditResultActiveKey).toBeCalledTimes(2);

    expect(mockSetAuditResultActiveKey).nthCalledWith(
      2,
      workflowTasks[0].task_id?.toString()
    );

    mockSetAuditResultActiveKey.mockClear();
    expect(
      screen.getByTestId(`operate-column-wrapper-${taskInfos[0].task_id}`)
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByTestId(`operate-column-wrapper-${taskInfos[0].task_id}`)
    );
    expect(mockSetAuditResultActiveKey).not.toBeCalled();

    fireEvent.click(
      screen.getAllByText('order.auditResultCollection.table.sqlExecute')[0]
    );
    expect(mockSetAuditResultActiveKey).not.toBeCalled();
    fireEvent.click(
      screen.getAllByText('order.auditResultCollection.table.scheduleTime')[0]
    );
    expect(mockSetAuditResultActiveKey).not.toBeCalled();

    fireEvent.click(screen.getAllByText('order.operator.terminate')[0]);
    expect(mockSetAuditResultActiveKey).not.toBeCalled();
  });
});
