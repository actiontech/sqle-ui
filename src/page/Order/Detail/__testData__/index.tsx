import {
  IAuditTaskResV1,
  IGetWorkflowTasksItemV2,
  IWorkflowResV2,
  IWorkflowTemplateDetailResV1,
} from '../../../../api/common';
import {
  AuditTaskResV1AuditLevelEnum,
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
} from '../../../../api/common.enum';

export const order = {
  workflow_id: '1',
  workflow_name: 'order123',
  create_user_name: 'admin',
  create_time: '2021-04-29T05:41:24Z',
  record: {
    tasks: [{ task_id: 5 }],
    current_step_number: 2,
    status: 'wait_for_execution',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-05-18T08:35:10Z',
      },
      {
        workflow_step_id: 2,
        number: 2,
        type: 'sql_execute',
        assignee_user_name_list: ['admin'],
        state: 'initialized',
      },
    ],
  },
} as IWorkflowResV2;

export const orderCancel = {
  workflow_id: '2',
  workflow_name: 'test',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:46:32Z',
  record: {
    tasks: [{ task_id: 5 }],
    status: 'canceled',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:46:32Z',
      },
      {
        workflow_step_id: 3,
        number: 2,
        type: 'sql_execute',
        assignee_user_name_list: ['admin'],
        state: 'initialized',
      },
    ],
  },
} as IWorkflowResV2;

export const orderReject = {
  workflow_id: '3',
  workflow_name: 'testccc',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:48:57Z',
  record: {
    tasks: [{ task_id: 6 }],
    status: 'rejected',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:48:57Z',
      },
      {
        workflow_step_id: 4,
        number: 2,
        type: 'sql_execute',
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:49:09Z',
        state: 'rejected',
        reason: 'test',
      },
    ],
  },
} as IWorkflowResV2;

export const orderPass = {
  workflow_id: '4',
  workflow_name: 'pass',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:57:25Z',
  record: {
    tasks: [{ task_id: 7 }],
    status: 'finished',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:57:25Z',
      },
      {
        workflow_step_id: 5,
        number: 2,
        type: 'sql_execute',
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:57:31Z',
        state: 'approved',
      },
    ],
  },
} as IWorkflowResV2;

export const orderWithExecScheduled = {
  workflow_id: '13',
  workflow_name: 'testq',
  create_user_name: 'admin',
  create_time: '2021-12-16T20:06:10+08:00',
  record: {
    tasks: [{ task_id: 16 }],
    current_step_number: 2,
    status: 'executing',
    schedule_time: '2021-12-16T20:09:55+08:00',
    schedule_user: 'admin',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-12-16T20:06:10+08:00',
      },
      {
        workflow_step_id: 27,
        number: 2,
        type: 'sql_execute',
        assignee_user_name_list: ['admin'],
        state: 'initialized',
      },
    ],
  },
} as IWorkflowResV2;

export const orderWithExecuting = {
  workflow_id: '13',
  workflow_name: 'testq',
  create_user_name: 'admin',
  create_time: '2021-12-16T20:06:10+08:00',
  record: {
    tasks: [{ task_id: 36 }],
    current_step_number: 2,
    status: 'executing',
    schedule_time: '2021-12-16T20:09:55+08:00',
    schedule_user: 'admin',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-12-16T20:06:10+08:00',
      },
      {
        workflow_step_id: 27,
        number: 2,
        type: 'sql_execute',
        assignee_user_name_list: ['admin'],
        state: 'initialized',
      },
    ],
  },
} as IWorkflowResV2;

export const order3 = {
  workflow_id: '1',
  workflow_name: 'order123',
  create_user_name: 'admin',
  create_time: '2021-04-29T05:41:24Z',
  record: {
    tasks: [{ task_id: 18 }],
    current_step_number: 2,
    status: 'wait_for_execution',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-05-18T08:35:10Z',
      },
      {
        workflow_step_id: 21,
        number: 2,
        type: 'sql_review',
        assignee_user_name_list: ['admin'],
      },
      {
        workflow_step_id: 22,
        number: 3,
        type: 'sql_execute',
        assignee_user_name_list: ['admin', 'test'],
        state: 'initialized',
      },
    ],
  },
} as IWorkflowResV2;
export const orderPass3 = {
  workflow_id: '4',
  workflow_name: 'pass',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:57:25Z',
  record: {
    tasks: [{ task_id: 19 }],
    status: 'finished',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:57:25Z',
      },
      {
        workflow_step_id: 31,
        number: 2,
        type: 'sql_review',
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:49:09Z',
        state: 'approved',
      },
      {
        workflow_step_id: 32,
        number: 3,
        type: 'sql_execute',
        assignee_user_name_list: ['admin', 'test'],
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:57:31Z',
        state: 'approved',
      },
    ],
  },
} as IWorkflowResV2;

export const orderCancel3 = {
  workflow_id: '2',
  workflow_name: 'test',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:46:32Z',
  record: {
    tasks: [{ task_id: 20 }],
    status: 'canceled',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:46:32Z',
      },
      {
        workflow_step_id: 23,
        number: 2,
        type: 'sql_review',
        assignee_user_name_list: ['admin'],
        state: 'initialized',
      },
      {
        workflow_step_id: 24,
        number: 3,
        type: 'sql_execute',
        assignee_user_name_list: ['admin', 'test'],
        state: 'initialized',
      },
    ],
  },
} as IWorkflowResV2;

export const orderReject3 = {
  workflow_id: '3',
  workflow_name: 'testccc',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:48:57Z',
  record: {
    tasks: [{ task_id: 21 }],
    status: 'rejected',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:48:57Z',
      },
      {
        workflow_step_id: 26,
        number: 2,
        type: 'sql_review',
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:49:09Z',
        state: 'approved',
      },
      {
        workflow_step_id: 27,
        number: 3,
        type: 'sql_execute',
        assignee_user_name_list: ['admin', 'test'],
        operation_user_name: 'admin',
        operation_time: '2021-05-20T02:49:09Z',
        state: 'rejected',
        reason: 'test',
      },
    ],
  },
} as IWorkflowResV2;

export const orderWithExecScheduled3 = {
  workflow_id: '4',
  workflow_name: 'execScheduled',
  create_user_name: 'admin',
  create_time: '2021-12-16T19:10:02+08:00',
  record: {
    tasks: [{ task_id: 22 }],
    current_step_number: 3,
    status: 'executing',
    schedule_time: '2021-12-18T19:16:59+08:00',
    schedule_user: 'admin',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-12-16T19:10:02+08:00',
      },
      {
        workflow_step_id: 11,
        number: 2,
        type: 'sql_review',
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2021-12-16T19:16:56+08:00',
        state: 'approved',
      },
      {
        workflow_step_id: 12,
        number: 3,
        type: 'sql_execute',
        assignee_user_name_list: ['admin', 'test'],
        state: 'initialized',
      },
    ],
  },
} as IWorkflowResV2;

export const orderWithExecuting3 = {
  workflow_id: '5',
  workflow_name: 'test_executing3',
  create_user_name: 'admin',
  create_time: '2021-12-16T19:37:02+08:00',
  record: {
    tasks: [{ task_id: 23 }],
    status: 'finished',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-12-16T19:37:02+08:00',
      },
      {
        workflow_step_id: 23,
        number: 2,
        type: 'sql_review',
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2021-12-16T19:38:14+08:00',
        state: 'approved',
      },
      {
        workflow_step_id: 24,
        number: 3,
        type: 'sql_execute',
        assignee_user_name_list: ['test'],
        operation_user_name: 'test',
        operation_time: '2021-12-16T19:38:25+08:00',
        state: 'approved',
      },
    ],
  },
} as IWorkflowResV2;
export const execScheduleSubmit3 = {
  workflow_id: '17',
  workflow_name: 'testtt',
  create_user_name: 'admin',
  create_time: '2021-12-16T20:29:40+08:00',

  record: {
    tasks: [{ task_id: 24 }],
    current_step_number: 3,
    status: 'wait_for_audit',
    workflow_step_list: [
      {
        number: 1,
        type: 'create_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-12-16T20:29:40+08:00',
      },
      {
        workflow_step_id: 31,
        number: 2,
        type: 'sql_review',
        assignee_user_name_list: ['admin'],
        operation_user_name: 'admin',
        operation_time: '2021-12-16T20:29:55+08:00',
        state: 'approved',
      },
      {
        workflow_step_id: 32,
        number: 3,
        type: 'sql_execute',
        assignee_user_name_list: ['admin'],
        state: 'initialized',
      },
    ],
  },
} as IWorkflowResV2;

export const orderWithHistory = {
  workflow_id: '1',
  workflow_name: 'order123',
  create_user_name: 'admin',
  create_time: '2021-04-29T05:41:24Z',
  record: {
    tasks: [{ task_id: 25 }],
    current_step_number: 2,
    status: 'wait_for_audit',
    workflow_step_list: [
      {
        number: 1,
        type: 'update_workflow',
        operation_user_name: 'admin',
        operation_time: '2021-05-18T08:35:10Z',
      },
      {
        workflow_step_id: 2,
        number: 2,
        type: 'sql_execute',
        assignee_user_name_list: ['admin'],
        state: 'initialized',
      },
    ],
  },
  record_history_list: [
    {
      tasks: [{ task_id: 26 }],
      status: 'rejected',
      workflow_step_list: [
        {
          number: 1,
          type: 'create_workflow',
          operation_user_name: 'admin',
          operation_time: '2021-04-29T05:41:24Z',
        },
        {
          workflow_step_id: 1,
          number: 2,
          type: 'sql_execute',
          assignee_user_name_list: ['admin'],
          operation_user_name: 'admin',
          operation_time: '2021-05-18T08:34:32Z',
          state: 'rejected',
          reason: 'test',
        },
      ],
    },
  ],
} as IWorkflowResV2;

export const taskInfo: IAuditTaskResV1 = {
  task_id: 27,
  instance_name: 'db1',
  instance_schema: '',
  pass_rate: 0,
  status: 'audited',
  sql_source: 'form_data',
  audit_level: AuditTaskResV1AuditLevelEnum.normal,
  score: 30,
} as IAuditTaskResV1;

export const taskInfoErrorAuditLevel: IAuditTaskResV1 = {
  task_id: 3,
  instance_name: 'db1',
  instance_schema: '',
  pass_rate: 0,
  status: 'audited',
  sql_source: 'form_data',
  audit_level: AuditTaskResV1AuditLevelEnum.error,
  score: 40,
} as IAuditTaskResV1;

export const taskInfoWarnAuditLevel: IAuditTaskResV1 = {
  task_id: 5,
  instance_name: 'db1',
  instance_schema: '',
  pass_rate: 0,
  status: 'audited',
  sql_source: 'form_data',
  audit_level: AuditTaskResV1AuditLevelEnum.warn,
  score: 40,
} as IAuditTaskResV1;

export const taskSqls = [
  {
    number: 1,
    exec_sql: '/* input your sql */\nuse aaab;',
    audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
    audit_level: 'error',
    audit_status: 'finished',
    exec_result: '',
    exec_status: 'initialized',
  },
  {
    number: 2,
    exec_sql: 'use bbbbe;',
    audit_result: null,
    audit_level: 'error',
    audit_status: 'finished',
    exec_result: '',
    exec_status: 'initialized',
    description: 'have a describe',
  },
  {
    number: 3,
    exec_sql: `CREATE TABLE \`tasks\` (
      \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
      \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      \`deleted_at\` timestamp NULL DEFAULT NULL,
      \`instance_id\` int(10) unsigned DEFAULT NULL,
      \`instance_schema\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`pass_rate\` double DEFAULT NULL,
      \`sql_type\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`sql_source\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`status\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'initialized',
      \`create_user_id\` int(10) unsigned DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      KEY \`idx_tasks_deleted_at\` (\`deleted_at\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    audit_result: [
      {
        level: 'error',
        message: 'schema bbbbe 不存在',
        rule_name: '',
      },
      {
        level: 'error',
        message: 'schema ddgrf 不存在',
        rule_name: '',
      },
    ],
    audit_level: 'error',
    audit_status: 'finished',
    exec_result: null,
    exec_status: 'initialized',
    description: 'this is a test',
  },
];

export const instanceWorkflowTemplate: IWorkflowTemplateDetailResV1 = {
  allow_submit_when_less_audit_level:
    WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
  desc: 'mock test data',
  instance_name_list: ['test'],
  workflow_template_name: 'test',
};

export const workflowTasks: IGetWorkflowTasksItemV2[] = [
  {
    current_step_assignee_user_name_list: ['admin', 'admin2'],
    exec_end_time: '2022-09-30',
    exec_start_time: '2022-09-01',
    instance_name: 'mysql-1',
    status: GetWorkflowTasksItemV2StatusEnum.wait_for_audit,
    task_id: 27,
    task_pass_rate: 0.3099,
    task_score: 30,
  },
  {
    current_step_assignee_user_name_list: ['admin', 'admin1'],
    exec_end_time: '2022-09-30',
    exec_start_time: '2022-09-01',
    instance_name: 'mysql-2',
    status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
    task_id: 28,
    task_pass_rate: 0,
    task_score: 30,
    schedule_time: '2022-09-30',
    instance_maintenance_times: [
      {
        maintenance_start_time: { hour: 0, minute: 0 },
        maintenance_stop_time: { hour: 20, minute: 0 },
      },
    ],
  },
  {
    current_step_assignee_user_name_list: ['admin'],
    exec_end_time: '2022-09-30',
    exec_start_time: '2022-09-01',
    instance_name: 'mysql-3',
    status: GetWorkflowTasksItemV2StatusEnum.exec_scheduled,
    task_id: 29,
    task_pass_rate: 0,
    task_score: 30,
    schedule_time: '2022-09-30',
  },
  {
    current_step_assignee_user_name_list: ['admin'],
    exec_end_time: '2022-09-30',
    exec_start_time: '2022-09-01',
    instance_name: 'mysql-4',
    status: GetWorkflowTasksItemV2StatusEnum.executing,
    task_id: 30,
    task_pass_rate: 0,
    task_score: 30,
    schedule_time: '2022-09-30',
  },
];
