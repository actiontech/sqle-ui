import {
  AuditPlanParamResV1TypeEnum,
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum,
  CreateAuditWhitelistReqV1MatchTypeEnum,
  CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  RuleParamResV1TypeEnum,
  RuleResV1LevelEnum,
  UpdateAuditWhitelistReqV1MatchTypeEnum,
  UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  WorkFlowStepTemplateReqV1TypeEnum,
  WorkflowDetailResV1CurrentStepTypeEnum,
  WorkflowDetailResV1StatusEnum,
  WorkflowRecordResV1StatusEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
  AuditPlanSQLHeadV2TypeEnum
} from './common.enum';

export interface IBaseRes {
  code?: number;

  message?: string;
}

export interface IAuditPlanMetaV1 {
  audit_plan_params?: IAuditPlanParamResV1[];

  audit_plan_type?: string;

  audit_plan_type_desc?: string;

  instance_type?: string;
}

export interface IAuditPlanParamReqV1 {
  key?: string;

  value?: string;
}

export interface IAuditPlanParamResV1 {
  desc?: string;

  key?: string;

  type?: AuditPlanParamResV1TypeEnum;

  value?: string;
}

export interface IAuditPlanReportResV1 {
  audit_plan_report_id?: string;

  audit_plan_report_timestamp?: string;
}

export interface IAuditPlanReportSQLResV1 {
  audit_plan_report_sql_audit_result?: string;

  audit_plan_report_sql_fingerprint?: string;

  audit_plan_report_sql_last_receive_text?: string;

  audit_plan_report_sql_last_receive_timestamp?: string;
}

export interface IAuditPlanResV1 {
  audit_plan_cron?: string;

  audit_plan_db_type?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_meta?: IAuditPlanMetaV1;

  audit_plan_name?: string;

  audit_plan_token?: string;
}

export interface IAuditPlanSQLReqV1 {
  audit_plan_sql_counter?: string;

  audit_plan_sql_fingerprint?: string;

  audit_plan_sql_last_receive_text?: string;

  audit_plan_sql_last_receive_timestamp?: string;
}

export interface IAuditPlanSQLResV1 {
  audit_plan_sql_counter?: string;

  audit_plan_sql_fingerprint?: string;

  audit_plan_sql_last_receive_text?: string;

  audit_plan_sql_last_receive_timestamp?: string;
}

export interface IAuditTaskResV1 {
  audit_level?: AuditTaskResV1AuditLevelEnum;

  exec_end_time?: string;

  exec_start_time?: string;

  instance_name?: string;

  instance_schema?: string;

  pass_rate?: number;

  sql_source?: AuditTaskResV1SqlSourceEnum;

  status?: AuditTaskResV1StatusEnum;

  task_id?: number;
}

export interface IAuditTaskSQLContentResV1 {
  sql?: string;
}

export interface IAuditTaskSQLResV1 {
  audit_level?: string;

  audit_result?: string;

  audit_status?: string;

  description?: string;

  exec_result?: string;

  exec_sql?: string;

  exec_status?: string;

  number?: number;

  rollback_sql?: string;
}

export interface IAuditWhitelistResV1 {
  audit_whitelist_id?: number;

  desc?: string;

  match_type?: string;

  value?: string;
}

export interface IBatchCancelWorkflowsReqV1 {
  workflow_ids?: string[];
}

export interface ICloneRuleTemplateReqV1 {
  desc?: string;

  instance_name_list?: string[];

  new_rule_template_name?: string;
}

export interface ICreateAuditPlanReqV1 {
  audit_plan_cron?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_instance_type?: string;

  audit_plan_name?: string;

  audit_plan_params?: IAuditPlanParamReqV1[];

  audit_plan_type?: string;
}

export interface ICreateAuditWhitelistReqV1 {
  desc?: string;

  match_type?: CreateAuditWhitelistReqV1MatchTypeEnum;

  value?: string;
}

export interface ICreateInstanceReqV1 {
  db_host?: string;

  db_password?: string;

  db_port?: string;

  db_type?: string;

  db_user?: string;

  desc?: string;

  instance_name?: string;

  role_name_list?: string[];

  rule_template_name_list?: string[];

  workflow_template_name?: string;
}

export interface ICreateRoleReqV1 {
  instance_name_list?: string[];

  role_desc?: string;

  role_name?: string;

  user_name_list?: string[];
}

export interface ICreateRuleTemplateReqV1 {
  db_type?: string;

  desc?: string;

  instance_name_list?: string[];

  rule_list?: IRuleReqV1[];

  rule_template_name?: string;
}

export interface ICreateUserReqV1 {
  email?: string;

  role_name_list?: string[];

  user_name?: string;

  user_password?: string;
}

export interface ICreateWorkflowReqV1 {
  desc?: string;

  task_id?: string;

  workflow_subject?: string;
}

export interface ICreateWorkflowTemplateReqV1 {
  allow_submit_when_less_audit_level?: CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum;

  desc?: string;

  instance_name_list?: string[];

  workflow_step_template_list?: IWorkFlowStepTemplateReqV1[];

  workflow_template_name?: string;
}

export interface IDashboardResV1 {
  workflow_statistics?: IWorkflowStatisticsResV1;
}

export interface IDriversResV1 {
  driver_name_list?: string[];
}

export interface IFullSyncAuditPlanSQLsReqV1 {
  audit_plan_sql_list?: IAuditPlanSQLReqV1[];
}

export interface IGetAuditPlanMetasResV1 {
  code?: number;

  data?: IAuditPlanMetaV1[];

  message?: string;
}

export interface IGetAuditPlanReportSQLsResV1 {
  code?: number;

  data?: IAuditPlanReportSQLResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlanReportsResV1 {
  code?: number;

  data?: IAuditPlanReportResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlanResV1 {
  code?: number;

  data?: IAuditPlanResV1;

  message?: string;
}

export interface IGetAuditPlanSQLsResV1 {
  code?: number;

  data?: IAuditPlanSQLResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlansResV1 {
  code?: number;

  data?: IAuditPlanResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditTaskResV1 {
  code?: number;

  data?: IAuditTaskResV1;

  message?: string;
}

export interface IGetAuditTaskSQLContentResV1 {
  code?: number;

  data?: IAuditTaskSQLContentResV1;

  message?: string;
}

export interface IGetAuditTaskSQLsResV1 {
  code?: number;

  data?: IAuditTaskSQLResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditWhitelistResV1 {
  code?: number;

  data?: IAuditWhitelistResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetDashboardResV1 {
  code?: number;

  data?: IDashboardResV1;

  message?: string;
}

export interface IGetDriversResV1 {
  code?: number;

  data?: IDriversResV1;

  message?: string;
}

export interface IGetInstanceConnectableReqV1 {
  db_type?: string;

  host?: string;

  password?: string;

  port?: string;

  user?: string;
}

export interface IGetInstanceConnectableResV1 {
  code?: number;

  data?: IInstanceConnectableResV1;

  message?: string;
}

export interface IGetInstanceResV1 {
  code?: number;

  data?: IInstanceResV1;

  message?: string;
}

export interface IGetInstanceSchemaResV1 {
  code?: number;

  data?: IInstanceSchemaResV1;

  message?: string;
}

export interface IGetInstanceTipsResV1 {
  code?: number;

  data?: IInstanceTipResV1[];

  message?: string;
}

export interface IGetInstanceWorkflowTemplateResV1 {
  code?: number;

  data?: IWorkflowTemplateDetailResV1;

  message?: string;
}

export interface IGetInstancesResV1 {
  code?: number;

  data?: IInstanceResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetLDAPConfigurationResV1 {
  code?: number;

  data?: ILDAPConfigurationResV1;

  message?: string;
}

export interface IGetRoleTipsResV1 {
  code?: number;

  data?: IRoleTipResV1[];

  message?: string;
}

export interface IGetRolesResV1 {
  code?: number;

  data?: IRoleResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetRuleTemplateResV1 {
  code?: number;

  data?: IRuleTemplateDetailResV1;

  message?: string;
}

export interface IGetRuleTemplateTipsResV1 {
  code?: number;

  data?: IRuleTemplateTipResV1[];

  message?: string;
}

export interface IGetRuleTemplatesResV1 {
  code?: number;

  data?: IRuleTemplateResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetRulesResV1 {
  code?: number;

  data?: IRuleResV1[];

  message?: string;
}

export interface IGetSMTPConfigurationResV1 {
  code?: number;

  data?: ISMTPConfigurationResV1;

  message?: string;
}

export interface IGetSQLEInfoResV1 {
  code?: number;

  message?: string;

  version?: string;
}

export interface IGetSystemVariablesResV1 {
  code?: number;

  data?: ISystemVariablesResV1;

  message?: string;
}

export interface IGetUserDetailResV1 {
  code?: number;

  data?: IUserDetailResV1;

  message?: string;
}

export interface IGetUserLoginResV1 {
  code?: number;

  data?: IUserLoginResV1;

  message?: string;
}

export interface IGetUserTipsResV1 {
  code?: number;

  data?: IUserTipResV1[];

  message?: string;
}

export interface IGetUsersResV1 {
  code?: number;

  data?: IUserResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetWorkflowResV1 {
  code?: number;

  data?: IWorkflowResV1;

  message?: string;
}

export interface IGetWorkflowTemplateResV1 {
  code?: number;

  data?: IWorkflowTemplateDetailResV1;

  message?: string;
}

export interface IGetWorkflowTemplateTipResV1 {
  code?: number;

  data?: IWorkflowTemplateTipResV1[];

  message?: string;
}

export interface IGetWorkflowTemplatesResV1 {
  code?: number;

  data?: IWorkflowTemplateResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetWorkflowsResV1 {
  code?: number;

  data?: IWorkflowDetailResV1[];

  message?: string;

  total_nums?: number;
}

export interface IInstanceConnectableResV1 {
  connect_error_message?: string;

  is_instance_connectable?: boolean;
}

export interface IInstanceResV1 {
  db_host?: string;

  db_port?: string;

  db_type?: string;

  db_user?: string;

  desc?: string;

  instance_name?: string;

  role_name_list?: string[];

  rule_template_name_list?: string[];

  workflow_template_name?: string;
}

export interface IInstanceSchemaResV1 {
  schema_name_list?: string[];
}

export interface IInstanceTipResV1 {
  instance_name?: string;

  instance_type?: string;
}

export interface ILDAPConfigurationReqV1 {
  enable_ldap?: boolean;

  ldap_connect_dn?: string;

  ldap_connect_pwd?: string;

  ldap_search_base_dn?: string;

  ldap_server_host?: string;

  ldap_server_port?: string;

  ldap_user_email_rdn_key?: string;

  ldap_user_name_rdn_key?: string;
}

export interface ILDAPConfigurationResV1 {
  enable_ldap?: boolean;

  ldap_connect_dn?: string;

  ldap_search_base_dn?: string;

  ldap_server_host?: string;

  ldap_server_port?: string;

  ldap_user_email_rdn_key?: string;

  ldap_user_name_rdn_key?: string;
}

export interface IPartialSyncAuditPlanSQLsReqV1 {
  audit_plan_sql_list?: IAuditPlanSQLReqV1[];
}

export interface IRejectWorkflowReqV1 {
  reason?: string;
}

export interface IRoleResV1 {
  instance_name_list?: string[];

  role_desc?: string;

  role_name?: string;

  user_name_list?: string[];
}

export interface IRoleTipResV1 {
  role_name?: string;
}

export interface IRuleParamReqV1 {
  key?: string;

  value?: string;
}

export interface IRuleParamResV1 {
  desc?: string;

  key?: string;

  type?: RuleParamResV1TypeEnum;

  value?: string;
}

export interface IRuleReqV1 {
  level?: string;

  name?: string;

  params?: IRuleParamReqV1[];
}

export interface IRuleResV1 {
  db_type?: string;

  desc?: string;

  level?: RuleResV1LevelEnum;

  params?: IRuleParamResV1[];

  rule_name?: string;

  type?: string;
}

export interface IRuleTemplateDetailResV1 {
  db_type?: string;

  desc?: string;

  instance_name_list?: string[];

  rule_list?: IRuleResV1[];

  rule_template_name?: string;
}

export interface IRuleTemplateResV1 {
  db_type?: string;

  desc?: string;

  instance_name_list?: string[];

  rule_template_name?: string;
}

export interface IRuleTemplateTipResV1 {
  db_type?: string;

  rule_template_name?: string;
}

export interface ISMTPConfigurationResV1 {
  smtp_host?: string;

  smtp_port?: string;

  smtp_username?: string;
}

export interface ISystemVariablesResV1 {
  workflow_expired_hours?: number;
}

export interface ITriggerAuditPlanResV1 {
  code?: number;

  data?: IAuditPlanReportResV1;

  message?: string;
}

export interface IUpdateAuditPlanReqV1 {
  audit_plan_cron?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_params?: IAuditPlanParamReqV1[];
}

export interface IUpdateAuditTaskSQLsReqV1 {
  description?: string;
}

export interface IUpdateAuditWhitelistReqV1 {
  desc?: string;

  match_type?: UpdateAuditWhitelistReqV1MatchTypeEnum;

  value?: string;
}

export interface IUpdateCurrentUserPasswordReqV1 {
  new_password?: string;

  password?: string;
}

export interface IUpdateCurrentUserReqV1 {
  email?: string;
}

export interface IUpdateInstanceReqV1 {
  db_host?: string;

  db_password?: string;

  db_port?: string;

  db_type?: string;

  db_user?: string;

  desc?: string;

  role_name_list?: string[];

  rule_template_name_list?: string[];

  workflow_template_name?: string;
}

export interface IUpdateOtherUserPasswordReqV1 {
  password?: string;
}

export interface IUpdateRoleReqV1 {
  instance_name_list?: string[];

  role_desc?: string;

  user_name_list?: string[];
}

export interface IUpdateRuleTemplateReqV1 {
  desc?: string;

  instance_name_list?: string[];

  rule_list?: IRuleReqV1[];
}

export interface IUpdateSMTPConfigurationReqV1 {
  smtp_host?: string;

  smtp_password?: string;

  smtp_port?: string;

  smtp_username?: string;
}

export interface IUpdateSystemVariablesReqV1 {
  workflow_expired_hours?: number;
}

export interface IUpdateUserReqV1 {
  email?: string;

  role_name_list?: string[];
}

export interface IUpdateWorkflowReqV1 {
  task_id?: string;
}

export interface IUpdateWorkflowScheduleV1 {
  schedule_time?: string;
}

export interface IUpdateWorkflowTemplateReqV1 {
  allow_submit_when_less_audit_level?: UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum;

  desc?: string;

  instance_name_list?: string[];

  workflow_step_template_list?: IWorkFlowStepTemplateReqV1[];
}

export interface IUserDetailResV1 {
  email?: string;

  is_admin?: boolean;

  login_type?: string;

  role_name_list?: string[];

  user_name?: string;
}

export interface IUserLoginReqV1 {
  password?: string;

  username?: string;
}

export interface IUserLoginResV1 {
  token?: string;
}

export interface IUserResV1 {
  email?: string;

  login_type?: string;

  role_name_list?: string[];

  user_name?: string;
}

export interface IUserTipResV1 {
  user_name?: string;
}

export interface IWorkFlowStepTemplateReqV1 {
  assignee_user_name_list?: string[];

  desc?: string;

  type?: WorkFlowStepTemplateReqV1TypeEnum;
}

export interface IWorkFlowStepTemplateResV1 {
  assignee_user_name_list?: string[];

  desc?: string;

  number?: number;

  type?: string;
}

export interface IWorkflowDetailResV1 {
  create_time?: string;

  create_user_name?: string;

  current_step_assignee_user_name_list?: string[];

  current_step_type?: WorkflowDetailResV1CurrentStepTypeEnum;

  desc?: string;

  schedule_time?: string;

  status?: WorkflowDetailResV1StatusEnum;

  subject?: string;

  task_instance_name?: string;

  task_instance_schema?: string;

  task_pass_rate?: number;

  workflow_id?: number;
}

export interface IWorkflowRecordResV1 {
  current_step_number?: number;

  schedule_time?: string;

  schedule_user?: string;

  status?: WorkflowRecordResV1StatusEnum;

  task_id?: number;

  workflow_step_list?: IWorkflowStepResV1[];
}

export interface IWorkflowResV1 {
  create_time?: string;

  create_user_name?: string;

  desc?: string;

  record?: IWorkflowRecordResV1;

  record_history_list?: IWorkflowRecordResV1[];

  subject?: string;

  workflow_id?: number;
}

export interface IWorkflowStatisticsResV1 {
  my_on_process_workflow_number?: number;

  my_rejected_workflow_number?: number;

  need_me_to_execute_workflow_number?: number;

  need_me_to_review_workflow_number?: number;
}

export interface IWorkflowStepResV1 {
  assignee_user_name_list?: string[];

  desc?: string;

  number?: number;

  operation_time?: string;

  operation_user_name?: string;

  reason?: string;

  state?: WorkflowStepResV1StateEnum;

  type?: WorkflowStepResV1TypeEnum;

  workflow_step_id?: number;
}

export interface IWorkflowTemplateDetailResV1 {
  allow_submit_when_less_audit_level?: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum;

  desc?: string;

  instance_name_list?: string[];

  workflow_step_template_list?: IWorkFlowStepTemplateResV1[];

  workflow_template_name?: string;
}

export interface IWorkflowTemplateResV1 {
  desc?: string;

  workflow_template_name?: string;
}

export interface IWorkflowTemplateTipResV1 {
  workflow_template_name?: string;
}

export interface IAuditPlanReportSQLResV2 {
  audit_plan_report_sql?: string;

  audit_plan_report_sql_audit_result?: string;
}

export interface IAuditPlanSQLHeadV2 {
  desc?: string;

  name?: string;

  type?: AuditPlanSQLHeadV2TypeEnum;
}

export interface IAuditPlanSQLResV2 {
  head?: IAuditPlanSQLHeadV2[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface IGetAuditPlanReportSQLsResV2 {
  code?: number;

  data?: IAuditPlanReportSQLResV2[];

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlanSQLsResV2 {
  code?: number;

  data?: IAuditPlanSQLResV2;

  message?: string;

  total_nums?: number;
}
