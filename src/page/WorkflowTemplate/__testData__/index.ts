import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from "../../../api/common.enum";

export const workflowData = {
  allow_submit_when_less_audit_level: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
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

export const workflowData2 = {
  allow_submit_when_less_audit_level: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error,
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
      assignee_user_name_list: [],
      approved_by_authorized: true,
    },
    {
      number: 3,
      type: 'sql_execute',
      desc: '3',
      assignee_user_name_list: [],
      execute_by_authorized: true,
    },
  ],
  instance_name_list: ['db1'],
};
