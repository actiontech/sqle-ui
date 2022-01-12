import {
  IAuditTaskResV1,
  IWorkflowResV1,
  IWorkflowTemplateDetailResV1,
} from '../../../../api/common';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '../../../../api/common.enum';

export const order = {
  workflow_id: 1,
  subject: 'order123',
  create_user_name: 'admin',
  create_time: '2021-04-29T05:41:24Z',
  record: {
    task_id: 3,
    current_step_number: 2,
    status: 'on_process',
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
} as IWorkflowResV1;

export const orderCancel = {
  workflow_id: 2,
  subject: 'test',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:46:32Z',
  record: {
    task_id: 5,
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
} as IWorkflowResV1;

export const orderReject = {
  workflow_id: 3,
  subject: 'testccc',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:48:57Z',
  record: {
    task_id: 6,
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
} as IWorkflowResV1;

export const orderPass = {
  workflow_id: 4,
  subject: 'pass',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:57:25Z',
  record: {
    task_id: 7,
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
} as IWorkflowResV1;

export const orderWithExecScheduled = {
  workflow_id: 13,
  subject: 'testq',
  create_user_name: 'admin',
  create_time: '2021-12-16T20:06:10+08:00',
  record: {
    task_id: 16,
    current_step_number: 2,
    status: 'exec_scheduled',
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
} as IWorkflowResV1;

export const orderWithExecuting = {
  task_id: 16,
  current_step_number: 2,
  status: 'exec_scheduled',
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
} as IWorkflowResV1;

export const order3 = {
  workflow_id: 1,
  subject: 'order123',
  create_user_name: 'admin',
  create_time: '2021-04-29T05:41:24Z',
  record: {
    task_id: 3,
    current_step_number: 2,
    status: 'on_process',
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
} as IWorkflowResV1;
export const orderPass3 = {
  workflow_id: 4,
  subject: 'pass',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:57:25Z',
  record: {
    task_id: 7,
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
} as IWorkflowResV1;

export const orderCancel3 = {
  workflow_id: 2,
  subject: 'test',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:46:32Z',
  record: {
    task_id: 5,
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
} as IWorkflowResV1;

export const orderReject3 = {
  workflow_id: 3,
  subject: 'testccc',
  create_user_name: 'admin',
  create_time: '2021-05-20T02:48:57Z',
  record: {
    task_id: 6,
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
} as IWorkflowResV1;

export const orderWithExecScheduled3 = {
  workflow_id: 4,
  subject: 'execScheduled',
  create_user_name: 'admin',
  create_time: '2021-12-16T19:10:02+08:00',
  record: {
    task_id: 6,
    current_step_number: 3,
    status: 'exec_scheduled',
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
} as IWorkflowResV1;

export const orderWithExecuting3 = {
  workflow_id: 5,
  subject: 'test_executing3',
  create_user_name: 'admin',
  create_time: '2021-12-16T19:37:02+08:00',
  record: {
    task_id: 14,
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
} as IWorkflowResV1;
export const execScheduleSubmit3 = {
  workflow_id: 17,
  subject: 'testtt',
  create_user_name: 'admin',
  create_time: '2021-12-16T20:29:40+08:00',
  record: {
    task_id: 23,
    current_step_number: 3,
    status: 'on_process',
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
} as IWorkflowResV1;

export const orderWithHistory = {
  workflow_id: 1,
  subject: 'order123',
  create_user_name: 'admin',
  create_time: '2021-04-29T05:41:24Z',
  record: {
    task_id: 3,
    current_step_number: 2,
    status: 'on_process',
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
      task_id: 2,
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
};

export const taskInfo: IAuditTaskResV1 = {
  task_id: 3,
  instance_name: 'db1',
  instance_schema: '',
  pass_rate: 0,
  status: 'audited',
  sql_source: 'form_data',
} as IAuditTaskResV1;

export const taskSqls = [
  {
    number: 1,
    exec_sql: '/* input your sql */\nuse aaab;',
    audit_result: '[error]schema aaab 不存在',
    audit_level: 'error',
    audit_status: 'finished',
    exec_result: '',
    exec_status: 'initialized',
  },
  {
    number: 2,
    exec_sql: 'use bbbbe;',
    audit_result: '[error]schema bbbbe 不存在',
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
    audit_result: '[error]schema bbbbe 不存在',
    audit_level: 'error',
    audit_status: 'finished',
    exec_result: '',
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
