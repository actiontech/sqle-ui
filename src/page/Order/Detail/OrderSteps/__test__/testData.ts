import { IWorkflowStepResV1 } from '../../../../../api/common';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
} from '../../../../../api/common.enum';
import { OrderStepsProps } from '../index.type';

export const stepList: IWorkflowStepResV1[] = [
  {
    number: 1,
    operation_time: '2022-10-12T16:25:03+08:00',
    operation_user_name: 'admin',
    type: WorkflowStepResV1TypeEnum.create_workflow,
  },
  {
    assignee_user_name_list: ['admin'],
    number: 2,
    operation_time: '2022-10-12T16:25:07+08:00',
    operation_user_name: 'admin',
    state: WorkflowStepResV1StateEnum.approved,
    type: WorkflowStepResV1TypeEnum.sql_review,
    workflow_step_id: 34,
  },
  {
    assignee_user_name_list: ['admin'],
    number: 3,
    state: WorkflowStepResV1StateEnum.approved,
    type: WorkflowStepResV1TypeEnum.sql_execute,
    workflow_step_id: 35,
  },
];

export const waitAuditStepList: IWorkflowStepResV1[] = [
  {
    number: 1,
    operation_time: '2022-10-13T13:53:28+08:00',
    operation_user_name: 'admin',
    type: WorkflowStepResV1TypeEnum.create_workflow,
  },
  {
    assignee_user_name_list: ['admin'],
    number: 2,
    state: WorkflowStepResV1StateEnum.initialized,
    type: WorkflowStepResV1TypeEnum.sql_review,
    workflow_step_id: 38,
  },
  {
    assignee_user_name_list: ['admin'],
    number: 3,
    state: WorkflowStepResV1StateEnum.initialized,
    type: WorkflowStepResV1TypeEnum.sql_execute,
    workflow_step_id: 39,
  },
];

export const rejectedStepList: IWorkflowStepResV1[] = [
  {
    number: 1,
    operation_time: '2022-10-13T13:53:28+08:00',
    operation_user_name: 'admin',
    type: WorkflowStepResV1TypeEnum.create_workflow,
  },
  {
    assignee_user_name_list: ['admin'],
    number: 2,
    operation_time: '2022-10-13T14:33:25+08:00',
    operation_user_name: 'admin',
    state: WorkflowStepResV1StateEnum.approved,
    type: WorkflowStepResV1TypeEnum.sql_review,
    workflow_step_id: 38,
  },
  {
    assignee_user_name_list: ['admin'],
    number: 3,
    operation_time: '2022-10-13T14:33:48+08:00',
    operation_user_name: 'admin',
    reason: 'test',
    state: WorkflowStepResV1StateEnum.rejected,
    type: WorkflowStepResV1TypeEnum.sql_execute,
    workflow_step_id: 39,
  },
];

export const executeStepList: IWorkflowStepResV1[] = [
  {
    number: 1,
    operation_time: '2022-10-13T15:13:20+08:00',
    operation_user_name: 'admin',
    type: WorkflowStepResV1TypeEnum.create_workflow,
  },
  {
    assignee_user_name_list: ['admin'],
    number: 2,
    operation_time: '2022-10-13T15:13:45+08:00',
    operation_user_name: 'admin',
    state: WorkflowStepResV1StateEnum.approved,
    type: WorkflowStepResV1TypeEnum.sql_review,
    workflow_step_id: 40,
  },
  {
    assignee_user_name_list: ['admin'],
    number: 3,
    operation_time: '2022-10-13T14:33:48+08:00',
    operation_user_name: 'admin',
    reason: 'test',
    state: WorkflowStepResV1StateEnum.initialized,
    type: WorkflowStepResV1TypeEnum.sql_execute,
    workflow_step_id: 41,
  },
];

export const otherStepList: IWorkflowStepResV1[] = [
  {
    number: 1,
    operation_time: '2022-10-12T16:25:03+08:00',
    operation_user_name: 'admin',
    type: WorkflowStepResV1TypeEnum.update_workflow,
  },
  {
    number: 1,
    operation_time: '2022-10-12T16:25:03+08:00',
    operation_user_name: 'admin',
    type: WorkflowStepResV1TypeEnum.create_workflow,
    state: WorkflowStepResV1StateEnum.initialized,
  },
  {
    number: 2,
    operation_time: '2022-10-12T16:25:03+08:00',
    operation_user_name: 'admin',
    type: WorkflowStepResV1TypeEnum.create_workflow,
    state: WorkflowStepResV1StateEnum.rejected,
  },
];
export const defaultProps: OrderStepsProps = {
  currentStep: undefined,
  readonly: false,
  currentOrderStatus: WorkflowRecordResV2StatusEnum.finished,
  tasksStatusNumber: {
    executing: 0,
    failed: 0,
    success: 1,
  },
  stepList,
  canRejectOrder: true,
  execEndTime: undefined,
  execStartTime: undefined,
  executing: () => new Promise(() => {}),
  maintenanceTimeInfo: [],
  modifySql: () => {},
  pass: () => new Promise(() => {}),
  reject: () => new Promise(() => {}),
};
