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
};

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
};

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
};

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
};

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

export const taskInfo = {
  task_id: 3,
  instance_name: 'db1',
  instance_schema: '',
  pass_rate: 0,
  status: 'audited',
  sql_source: 'form_data',
};

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
  },
];
