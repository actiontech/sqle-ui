export const workflowData = {
  workflow_template_name: 'db1',
  desc: '123',
  workflow_step_template_list: [
    {
      number: 1,
      type: 'sql_review',
      desc: '1',
      assignee_user_name_list: ['admin'],
    },
    {
      number: 2,
      type: 'sql_review',
      desc: '2',
      assignee_user_name_list: ['admin'],
      approved_by_authorized: true,
    },
    {
      number: 3,
      type: 'sql_execute',
      desc: '3',
      assignee_user_name_list: ['admin'],
    },
  ],
  instance_name_list: ['db1'],
};
