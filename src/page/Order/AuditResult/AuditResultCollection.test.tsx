import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IAuditTaskResV1, IGetWorkflowTasksItemV1 } from '../../../api/common';
import {
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum,
  GetWorkflowTasksItemV1StatusEnum,
} from '../../../api/common.enum';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { taskSqls } from '../Detail/__testData__';
import AuditResultCollection from './AuditResultCollection';

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

const workflowTasks: IGetWorkflowTasksItemV1[] = [
  {
    current_step_assignee_user_name_list: ['admin1', 'admin2'],
    exec_end_time: '2022-09-30',
    exec_start_time: '2022-09-01',
    instance_name: 'mysql-1',
    status: GetWorkflowTasksItemV1StatusEnum.wait_for_audit,
    task_id: 27,
    task_pass_rate: 0.3099,
    task_score: 30,
  },
  {
    current_step_assignee_user_name_list: ['admin3', 'admin1'],
    exec_end_time: '2022-09-30',
    exec_start_time: '2022-09-01',
    instance_name: 'mysql-2',
    status: GetWorkflowTasksItemV1StatusEnum.wait_for_execution,
    task_id: 28,
    task_pass_rate: 0,
    task_score: 30,
    schedule_time: '2022-09-30',
  },
];

const activeKey = taskInfos[0].task_id?.toString()!;
const workflowId = '22';

describe.skip('test AuditResultCollection', () => {
  const mockSetAuditResultActiveKey = jest.fn();
  beforeEach(() => {
    mockGetTaskSqls();
    mockUpdateTaskSqlDesc();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  const mockGetTaskSqls = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV1');
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
    const spy = jest.spyOn(workflow, 'getSummaryOfInstanceTasksV1');
    spy.mockImplementation(() => resolveThreeSecond(workflowTasks));
    return spy;
  };

  const mockFailedGetSummaryOfInstanceTasks = () => {
    const spy = jest.spyOn(workflow, 'getSummaryOfInstanceTasksV1');
    spy.mockImplementation(() => resolveErrorThreeSecond({}));
    return spy;
  };

  test('should match snapshot when showOverview is equal false', () => {
    const { container } = render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={activeKey}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
      />
    );

    expect(container).toMatchSnapshot();
  });

  test('should called setAuditResultActiveKey when change tab', () => {
    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={activeKey}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
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

  test('should be show overview tab when showOverview is equal true', () => {
    render(
      <AuditResultCollection
        taskInfos={taskInfos}
        auditResultActiveKey={activeKey}
        setAuditResultActiveKey={mockSetAuditResultActiveKey}
        updateTaskRecordTotalNum={jest.fn()}
        showOverview={true}
      />
    );
    expect(
      screen.getByText('order.auditResultCollection.overview')
    ).toBeInTheDocument();
    expect(mockSetAuditResultActiveKey).toBeCalledTimes(1);
    expect(mockSetAuditResultActiveKey).toBeCalledWith('OVERVIEW_TAB_KEY');
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
      />
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getSummaryOfInstanceTasks).toBeCalledTimes(1);
    expect(getSummaryOfInstanceTasks).toBeCalledWith({
      workflow_id: Number(workflowId),
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
      />
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
