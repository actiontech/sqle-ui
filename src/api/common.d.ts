import {
  AuditPlanParamResV1TypeEnum,
  AuditPlanReportResV1AuditLevelEnum,
  AuditPlanSQLHeadV1TypeEnum,
  AuditPlanTypesV1InstanceTypeEnum,
  AuditResDataV1AuditLevelEnum,
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum,
  CreateAuditWhitelistReqV1MatchTypeEnum,
  DirectAuditReqV1SqlTypeEnum,
  GetWorkflowTasksItemV1StatusEnum,
  InstanceTaskResV1LastSyncStatusEnum,
  RuleParamResV1TypeEnum,
  RuleResV1LevelEnum,
  SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum,
  SQLQueryConfigResV1AllowQueryWhenLessThanAuditLevelEnum,
  UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum,
  UpdateAuditWhitelistReqV1MatchTypeEnum,
  UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  WorkFlowStepTemplateReqV1TypeEnum,
  WorkflowDetailResV1CurrentStepTypeEnum,
  WorkflowDetailResV1StatusEnum,
  WorkflowRecordResV1StatusEnum,
  WorkflowResV1ModeEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ModeEnum,
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum
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
  audit_level?: AuditPlanReportResV1AuditLevelEnum;

  audit_plan_report_id?: string;

  audit_plan_report_timestamp?: string;

  pass_rate?: number;

  score?: number;
}

export interface IAuditPlanReportSQLResV1 {
  audit_plan_report_sql?: string;

  audit_plan_report_sql_audit_result?: string;

  number?: number;
}

export interface IAuditPlanResV1 {
  audit_plan_cron?: string;

  audit_plan_db_type?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_meta?: IAuditPlanMetaV1;

  audit_plan_name?: string;

  audit_plan_token?: string;

  rule_template_name?: string;
}

export interface IAuditPlanSQLHeadV1 {
  desc?: string;

  name?: string;

  type?: AuditPlanSQLHeadV1TypeEnum;
}

export interface IAuditPlanSQLReqV1 {
  audit_plan_sql_counter?: string;

  audit_plan_sql_fingerprint?: string;

  audit_plan_sql_last_receive_text?: string;

  audit_plan_sql_last_receive_timestamp?: string;

  audit_plan_sql_schema?: string;
}

export interface IAuditPlanSQLResV1 {
  head?: IAuditPlanSQLHeadV1[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface IAuditPlanTypesV1 {
  desc?: string;

  instance_type?: AuditPlanTypesV1InstanceTypeEnum;

  type?: string;
}

export interface IAuditResDataV1 {
  audit_level?: AuditResDataV1AuditLevelEnum;

  pass_rate?: number;

  score?: number;

  sql_results?: IAuditSQLResV1[];
}

export interface IAuditSQLResV1 {
  audit_level?: string;

  audit_result?: string;

  exec_sql?: string;

  number?: number;
}

export interface IAuditTaskGroupRes {
  task_group_id?: number;

  tasks?: IAuditTaskResV1[];
}

export interface IAuditTaskGroupResV1 {
  code?: number;

  data?: IAuditTaskGroupRes;

  message?: string;
}

export interface IAuditTaskResV1 {
  audit_level?: AuditTaskResV1AuditLevelEnum;

  exec_end_time?: string;

  exec_start_time?: string;

  instance_db_type?: string;

  instance_name?: string;

  instance_schema?: string;

  pass_rate?: number;

  score?: number;

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

export interface IAuditTasksGroupResV1 {
  task_group_id?: number;
}

export interface IAuditWhitelistResV1 {
  audit_whitelist_id?: number;

  desc?: string;

  match_type?: string;

  value?: string;
}

export interface IBatchCancelWorkflowsReqV1 {
  workflow_names?: string[];
}

export interface IBatchCheckInstanceConnectionsReqV1 {
  instances?: IInstanceForCheckConnection[];
}

export interface IBatchCompleteWorkflowsReqV1 {
  workflow_names?: string[];
}

export interface IBatchGetInstanceConnectionsResV1 {
  code?: number;

  data?: IInstanceConnectionResV1[];

  message?: string;
}

export interface IBindOauth2UserReqV1 {
  oauth2_token?: string;

  pwd?: string;

  user_name?: string;
}

export interface IBindOauth2UserResDataV1 {
  token?: string;
}

export interface IBindOauth2UserResV1 {
  code?: number;

  data?: IBindOauth2UserResDataV1;

  message?: string;
}

export interface IBindRoleReqV1 {
  instance_name?: string;

  role_names?: string[];
}

export interface ICheckLicenseResV1 {
  code?: number;

  content?: string;

  license?: ILicenseItem[];

  message?: string;
}

export interface ICloneProjectRuleTemplateReqV1 {
  desc?: string;

  instance_name_list?: string[];

  new_rule_template_name?: string;
}

export interface ICloneRuleTemplateReqV1 {
  desc?: string;

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

  rule_template_name?: string;
}

export interface ICreateAuditTasksGroupReqV1 {
  instances?: IInstanceForCreatingTask[];
}

export interface ICreateAuditTasksGroupResV1 {
  code?: number;

  data?: IAuditTasksGroupResV1;

  message?: string;
}

export interface ICreateAuditWhitelistReqV1 {
  desc?: string;

  match_type?: CreateAuditWhitelistReqV1MatchTypeEnum;

  value?: string;
}

export interface ICreateInstanceReqV1 {
  additional_params?: IInstanceAdditionalParamReqV1[];

  db_host?: string;

  db_password?: string;

  db_port?: string;

  db_type?: string;

  db_user?: string;

  desc?: string;

  instance_name?: string;

  maintenance_times?: IMaintenanceTimeReqV1[];

  rule_template_name?: string;

  sql_query_config?: ISQLQueryConfigReqV1;
}

export interface ICreateMemberGroupReqV1 {
  roles?: IBindRoleReqV1[];

  user_group_name?: string;
}

export interface ICreateMemberReqV1 {
  is_manager?: boolean;

  roles?: IBindRoleReqV1[];

  user_name?: string;
}

export interface ICreateProjectReqV1 {
  desc?: string;

  name?: string;
}

export interface ICreateProjectRuleTemplateReqV1 {
  db_type?: string;

  desc?: string;

  instance_name_list?: string[];

  rule_list?: IRuleReqV1[];

  rule_template_name?: string;
}

export interface ICreateRoleReqV1 {
  operation_code_list?: number[];

  role_desc?: string;

  role_name?: string;
}

export interface ICreateRuleTemplateReqV1 {
  db_type?: string;

  desc?: string;

  rule_list?: IRuleReqV1[];

  rule_template_name?: string;
}

export interface ICreateSyncInstanceTaskReqV1 {
  db_type: string;

  global_rule_template: string;

  source: string;

  sync_instance_interval: string;

  url: string;

  version: string;
}

export interface ICreateUserGroupReqV1 {
  user_group_desc?: string;

  user_group_name?: string;

  user_name_list?: string[];
}

export interface ICreateUserReqV1 {
  email?: string;

  management_permission_code_list?: number[];

  phone?: string;

  user_group_name_list?: string[];

  user_name?: string;

  user_password?: string;

  wechat_id?: string;
}

export interface ICreateWorkflowReqV1 {
  desc?: string;

  task_ids?: number[];

  workflow_subject?: string;
}

export interface IDashboardResV1 {
  workflow_statistics?: IWorkflowStatisticsResV1;
}

export interface IDingTalkConfigurationV1 {
  app_key?: string;

  is_enable_ding_talk_notify?: boolean;
}

export interface IDirectAuditReqV1 {
  instance_type?: string;

  sql_content?: string;

  sql_type?: DirectAuditReqV1SqlTypeEnum;
}

export interface IDirectAuditResV1 {
  code?: number;

  data?: IAuditResDataV1;

  message?: string;
}

export interface IDriversResV1 {
  driver_name_list?: string[];
}

export interface IExplainClassicResult {
  head?: ITableMetaItemHeadResV1[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface IFullSyncAuditPlanSQLsReqV1 {
  audit_plan_sql_list?: IAuditPlanSQLReqV1[];
}

export interface IGetAuditPlanAnalysisDataResV1 {
  code?: number;

  data?: IGetSQLAnalysisDataResItemV1;

  message?: string;
}

export interface IGetAuditPlanMetasResV1 {
  code?: number;

  data?: IAuditPlanMetaV1[];

  message?: string;
}

export interface IGetAuditPlanNotifyConfigResDataV1 {
  enable_email_notify?: boolean;

  enable_web_hook_notify?: boolean;

  notify_interval?: number;

  notify_level?: string;

  web_hook_template?: string;

  web_hook_url?: string;
}

export interface IGetAuditPlanNotifyConfigResV1 {
  code?: number;

  data?: IGetAuditPlanNotifyConfigResDataV1;

  message?: string;
}

export interface IGetAuditPlanReportResV1 {
  code?: number;

  data?: IAuditPlanReportResV1;

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

  data?: IAuditPlanSQLResV1;

  message?: string;

  total_nums?: number;
}

export interface IGetAuditPlanTypesResV1 {
  code?: number;

  data?: IAuditPlanTypesV1[];

  message?: string;
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

export interface IGetDingTalkConfigurationResV1 {
  code?: number;

  data?: IDingTalkConfigurationV1;

  message?: string;
}

export interface IGetDriversResV1 {
  code?: number;

  data?: IDriversResV1;

  message?: string;
}

export interface IGetInstanceAdditionalMetasResV1 {
  code?: number;

  data?: IInstanceAdditionalMetaV1[];

  message?: string;
}

export interface IGetInstanceConnectableReqV1 {
  additional_params?: IInstanceAdditionalParamReqV1[];

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

export interface IGetInstancesResV1 {
  code?: number;

  data?: IInstanceResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetInstancesTypePercentResV1 {
  code?: number;

  data?: IInstancesTypePercentV1;

  message?: string;
}

export interface IGetLDAPConfigurationResV1 {
  code?: number;

  data?: ILDAPConfigurationResV1;

  message?: string;
}

export interface IGetLicenseResV1 {
  code?: number;

  content?: string;

  license?: ILicenseItem[];

  message?: string;
}

export interface IGetLicenseUsageResV1 {
  code?: number;

  data?: ILicenseUsageV1;

  message?: string;
}

export interface IGetManagementPermissionsResV1 {
  code?: number;

  data?: IManagementPermissionResV1[];

  message?: string;
}

export interface IGetMemberGroupRespDataV1 {
  roles?: IBindRoleReqV1[];

  user_group_name?: string;

  users?: IMemberGroupUserItem[];
}

export interface IGetMemberGroupRespV1 {
  code?: number;

  data?: IGetMemberGroupRespDataV1;

  message?: string;
}

export interface IGetMemberGroupsRespV1 {
  code?: number;

  data?: IGetMemberGroupRespDataV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetMemberRespDataV1 {
  is_manager?: boolean;

  roles?: IBindRoleReqV1[];

  user_name?: string;
}

export interface IGetMemberRespV1 {
  code?: number;

  data?: IGetMemberRespDataV1;

  message?: string;
}

export interface IGetMemberTipsResV1 {
  code?: number;

  data?: IMemberTipResV1[];

  message?: string;
}

export interface IGetMembersRespV1 {
  code?: number;

  data?: IGetMemberRespDataV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetOauth2ConfigurationResDataV1 {
  access_token_tag?: string;

  client_host?: string;

  client_id?: string;

  enable_oauth2?: boolean;

  login_tip?: string;

  scopes?: string[];

  server_auth_url?: string;

  server_token_url?: string;

  server_user_id_url?: string;

  user_id_tag?: string;
}

export interface IGetOauth2ConfigurationResV1 {
  code?: number;

  data?: IGetOauth2ConfigurationResDataV1;

  message?: string;
}

export interface IGetOauth2TipsResDataV1 {
  enable_oauth2?: boolean;

  login_tip?: string;
}

export interface IGetOauth2TipsResV1 {
  code?: number;

  data?: IGetOauth2TipsResDataV1;

  message?: string;
}

export interface IGetOperationsResV1 {
  code?: number;

  data?: IOperationResV1[];

  message?: string;
}

export interface IGetProjectDetailResV1 {
  code?: number;

  data?: IProjectDetailItem;

  message?: string;
}

export interface IGetProjectResV1 {
  code?: number;

  data?: IProjectListItem[];

  message?: string;

  total_nums?: number;
}

export interface IGetProjectRuleTemplateResV1 {
  code?: number;

  data?: IRuleProjectTemplateDetailResV1;

  message?: string;
}

export interface IGetProjectRuleTemplatesResV1 {
  code?: number;

  data?: IProjectRuleTemplateResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetProjectStatisticsResDataV1 {
  audit_plan_total?: number;

  instance_total?: number;

  member_total?: number;

  rule_template_total?: number;

  whitelist_total?: number;

  workflow_total?: number;
}

export interface IGetProjectStatisticsResV1 {
  code?: number;

  data?: IGetProjectStatisticsResDataV1;

  message?: string;
}

export interface IGetProjectTipsResV1 {
  code?: number;

  data?: IProjectTipResV1[];

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

export interface IGetSQLAnalysisDataResItemV1 {
  sql_explain?: ISQLExplain;

  table_metas?: ITableMeta[];
}

export interface IGetSQLEInfoResV1 {
  code?: number;

  message?: string;

  version?: string;
}

export interface IGetSQLQueryConfigurationResDataV1 {
  enable_sql_query?: boolean;

  sql_query_root_uri?: string;
}

export interface IGetSQLQueryConfigurationResV1 {
  code?: number;

  data?: IGetSQLQueryConfigurationResDataV1;

  message?: string;
}

export interface IGetSqlAverageExecutionTimeResV1 {
  code?: number;

  data?: ISqlAverageExecutionTime[];

  message?: string;
}

export interface IGetSqlExecutionFailPercentResV1 {
  code?: number;

  data?: ISqlExecutionFailPercent[];

  message?: string;
}

export interface IGetSyncInstanceTaskListResV1 {
  code?: number;

  data?: IInstanceTaskResV1[];

  message?: string;
}

export interface IGetSyncInstanceTaskResV1 {
  code?: number;

  data?: IInstanceTaskDetailResV1;

  message?: string;
}

export interface IGetSyncTaskSourceTipsResV1 {
  code?: number;

  data?: ISyncTaskTipsResV1[];

  message?: string;
}

export interface IGetSystemVariablesResV1 {
  code?: number;

  data?: ISystemVariablesResV1;

  message?: string;
}

export interface IGetTableMetadataResV1 {
  code?: number;

  data?: IInstanceTableMeta;

  message?: string;
}

export interface IGetTaskAnalysisDataResItemV1 {
  sql_explain?: ISQLExplain;

  table_metas?: ITableMeta[];
}

export interface IGetTaskAnalysisDataResV1 {
  code?: number;

  data?: IGetTaskAnalysisDataResItemV1;

  message?: string;
}

export interface IGetUserDetailResV1 {
  code?: number;

  data?: IUserDetailResV1;

  message?: string;
}

export interface IGetUserGroupTipsResV1 {
  code?: number;

  data?: IUserGroupTipListItem[];

  message?: string;
}

export interface IGetUserGroupsResV1 {
  code?: number;

  data?: IUserGroupListItemResV1[];

  message?: string;

  total_nums?: number;
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

export interface IGetWeChatConfigurationResV1 {
  code?: number;

  data?: IWeChatConfigurationResV1;

  message?: string;
}

export interface IGetWorkflowAuditPassPercentResV1 {
  code?: number;

  data?: IWorkflowAuditPassPercentV1;

  message?: string;
}

export interface IGetWorkflowCountsResV1 {
  code?: number;

  data?: IWorkflowCountsV1;

  message?: string;
}

export interface IGetWorkflowCreatedCountsEachDayResV1 {
  code?: number;

  data?: IWorkflowCreatedCountsEachDayV1;

  message?: string;
}

export interface IGetWorkflowDurationOfWaitingForAuditResV1 {
  code?: number;

  data?: IWorkflowStageDuration;

  message?: string;
}

export interface IGetWorkflowDurationOfWaitingForExecutionResV1 {
  code?: number;

  data?: IWorkflowStageDuration;

  message?: string;
}

export interface IGetWorkflowPassPercentResV1 {
  code?: number;

  data?: IWorkflowPassPercentV1;

  message?: string;
}

export interface IGetWorkflowPercentCountedByInstanceTypeResV1 {
  code?: number;

  data?: IWorkflowPercentCountedByInstanceTypeV1;

  message?: string;
}

export interface IGetWorkflowRejectedPercentGroupByCreatorResV1 {
  code?: number;

  data?: IWorkflowRejectedPercentGroupByCreator[];

  message?: string;
}

export interface IGetWorkflowRejectedPercentGroupByInstanceResV1 {
  code?: number;

  data?: IWorkflowRejectedPercentGroupByInstance[];

  message?: string;
}

export interface IGetWorkflowResV1 {
  code?: number;

  data?: IWorkflowResV1;

  message?: string;
}

export interface IGetWorkflowStatusCountResV1 {
  code?: number;

  data?: IWorkflowStatusCountV1;

  message?: string;
}

export interface IGetWorkflowTasksItemV1 {
  current_step_assignee_user_name_list?: string[];

  exec_end_time?: string;

  exec_start_time?: string;

  execution_user_name?: string;

  instance_maintenance_times?: IMaintenanceTimeResV1[];

  instance_name?: string;

  schedule_time?: string;

  status?: GetWorkflowTasksItemV1StatusEnum;

  task_id?: number;

  task_pass_rate?: number;

  task_score?: number;
}

export interface IGetWorkflowTasksResV1 {
  code?: number;

  data?: IGetWorkflowTasksItemV1[];

  message?: string;
}

export interface IGetWorkflowTemplateResV1 {
  code?: number;

  data?: IWorkflowTemplateDetailResV1;

  message?: string;
}

export interface IGetWorkflowsResV1 {
  code?: number;

  data?: IWorkflowDetailResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGlobalRuleTemplateInstance {
  instance_name?: string;

  project_name?: string;
}

export interface IInstanceAdditionalMetaV1 {
  db_type?: string;

  params?: IInstanceAdditionalParamResV1[];
}

export interface IInstanceAdditionalParamReqV1 {
  name?: string;

  value?: string;
}

export interface IInstanceAdditionalParamResV1 {
  description?: string;

  name?: string;

  type?: string;

  value?: string;
}

export interface IInstanceConnectableResV1 {
  connect_error_message?: string;

  is_instance_connectable?: boolean;
}

export interface IInstanceConnectionResV1 {
  connect_error_message?: string;

  instance_name?: string;

  is_instance_connectable?: boolean;
}

export interface IInstanceForCheckConnection {
  name?: string;
}

export interface IInstanceForCreatingTask {
  instance_name?: string;

  instance_schema?: string;
}

export interface IInstanceResV1 {
  additional_params?: IInstanceAdditionalParamResV1[];

  db_host?: string;

  db_port?: string;

  db_type?: string;

  db_user?: string;

  desc?: string;

  instance_name?: string;

  maintenance_times?: IMaintenanceTimeResV1[];

  rule_template_name?: string;

  source?: string;

  sql_query_config?: ISQLQueryConfigResV1;
}

export interface IInstanceSchemaResV1 {
  schema_name_list?: string[];
}

export interface IInstanceTableMeta {
  columns?: ITableColumns;

  create_table_sql?: string;

  indexes?: ITableIndexes;

  name?: string;

  schema?: string;
}

export interface IInstanceTaskDetailResV1 {
  db_type?: string;

  id?: number;

  rule_template?: string;

  source?: string;

  sync_instance_interval?: string;

  url?: string;

  version?: string;
}

export interface IInstanceTaskResV1 {
  db_type?: string;

  id?: number;

  last_sync_status?: InstanceTaskResV1LastSyncStatusEnum;

  last_sync_success_time?: string;

  source?: string;

  url?: string;

  version?: string;
}

export interface IInstanceTipResV1 {
  host?: string;

  instance_name?: string;

  instance_type?: string;

  port?: string;

  workflow_template_id?: number;
}

export interface IInstanceTypePercent {
  count?: number;

  percent?: number;

  type?: string;
}

export interface IInstancesTypePercentV1 {
  instance_total_num?: number;

  instance_type_percents?: IInstanceTypePercent[];
}

export interface ILDAPConfigurationReqV1 {
  enable_ldap?: boolean;

  enable_ssl?: boolean;

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

  enable_ssl?: boolean;

  ldap_connect_dn?: string;

  ldap_search_base_dn?: string;

  ldap_server_host?: string;

  ldap_server_port?: string;

  ldap_user_email_rdn_key?: string;

  ldap_user_name_rdn_key?: string;
}

export interface ILicenseItem {
  description?: string;

  limit?: string;

  name?: string;
}

export interface ILicenseUsageItem {
  is_limited?: boolean;

  limit?: number;

  resource_type?: string;

  resource_type_desc?: string;

  used?: number;
}

export interface ILicenseUsageV1 {
  instances_usage?: ILicenseUsageItem[];

  users_usage?: ILicenseUsageItem;
}

export interface IListTableBySchemaResV1 {
  code?: number;

  data?: ITable[];

  message?: string;
}

export interface IMaintenanceTimeReqV1 {
  maintenance_start_time?: ITimeReqV1;

  maintenance_stop_time?: ITimeReqV1;
}

export interface IMaintenanceTimeResV1 {
  maintenance_start_time?: ITimeResV1;

  maintenance_stop_time?: ITimeResV1;
}

export interface IManagementPermissionResV1 {
  code?: number;

  desc?: string;
}

export interface IMemberGroupUserItem {
  name?: string;
}

export interface IMemberTipResV1 {
  user_name?: string;
}

export interface IOauth2ConfigurationReqV1 {
  access_token_tag?: string;

  client_host?: string;

  client_id?: string;

  client_key?: string;

  enable_oauth2?: boolean;

  login_tip?: string;

  scopes?: string[];

  server_auth_url?: string;

  server_token_url?: string;

  server_user_id_url?: string;

  user_id_tag?: string;
}

export interface IOperation {
  op_code?: number;

  op_desc?: string;
}

export interface IOperationResV1 {
  op_code?: number;

  op_desc?: string;
}

export interface IParseProjectRuleTemplateFileResDataV1 {
  db_type?: string;

  desc?: string;

  name?: string;

  rule_list?: IRuleResV1[];
}

export interface IParseProjectRuleTemplateFileResV1 {
  code?: number;

  data?: IParseProjectRuleTemplateFileResDataV1;

  message?: string;
}

export interface IPartialSyncAuditPlanSQLsReqV1 {
  audit_plan_sql_list?: IAuditPlanSQLReqV1[];
}

export interface IPatchUserGroupReqV1 {
  is_disabled?: boolean;

  user_group_desc?: string;

  user_name_list?: string[];
}

export interface IProjectDetailItem {
  create_time?: string;

  create_user_name?: string;

  desc?: string;

  name?: string;
}

export interface IProjectListItem {
  create_time?: string;

  create_user_name?: string;

  desc?: string;

  name?: string;
}

export interface IProjectRuleTemplateInstance {
  name?: string;
}

export interface IProjectRuleTemplateResV1 {
  db_type?: string;

  desc?: string;

  instance_list?: IProjectRuleTemplateInstance[];

  rule_template_name?: string;
}

export interface IProjectTipResV1 {
  project_name?: string;
}

export interface IRejectWorkflowReqV1 {
  reason?: string;
}

export interface IRoleResV1 {
  is_disabled?: boolean;

  operation_list?: IOperation[];

  role_desc?: string;

  role_name?: string;
}

export interface IRoleTipResV1 {
  operations?: IOperation[];

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

export interface IRuleProjectTemplateDetailResV1 {
  db_type?: string;

  desc?: string;

  instance_list?: IProjectRuleTemplateInstance[];

  rule_list?: IRuleResV1[];

  rule_template_name?: string;
}

export interface IRuleReqV1 {
  level?: string;

  name?: string;

  params?: IRuleParamReqV1[];
}

export interface IRuleResV1 {
  annotation?: string;

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

  instance_list?: IGlobalRuleTemplateInstance[];

  rule_list?: IRuleResV1[];

  rule_template_name?: string;
}

export interface IRuleTemplateResV1 {
  db_type?: string;

  desc?: string;

  instance_list?: IGlobalRuleTemplateInstance[];

  rule_template_name?: string;
}

export interface IRuleTemplateTipResV1 {
  db_type?: string;

  rule_template_name?: string;
}

export interface ISMTPConfigurationResV1 {
  enable_smtp_notify?: boolean;

  smtp_host?: string;

  smtp_port?: string;

  smtp_username?: string;
}

export interface ISQLExplain {
  classic_result?: IExplainClassicResult;

  message?: string;

  sql?: string;
}

export interface ISQLQueryConfigReqV1 {
  allow_query_when_less_than_audit_level?: SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum;

  audit_enabled?: boolean;

  max_pre_query_rows?: number;

  query_timeout_second?: number;
}

export interface ISQLQueryConfigResV1 {
  allow_query_when_less_than_audit_level?: SQLQueryConfigResV1AllowQueryWhenLessThanAuditLevelEnum;

  audit_enabled?: boolean;

  max_pre_query_rows?: number;

  query_timeout_second?: number;
}

export interface ISqlAverageExecutionTime {
  average_execution_seconds?: number;

  instance_name?: string;

  max_execution_seconds?: number;

  min_execution_seconds?: number;
}

export interface ISqlExecutionFailPercent {
  instance_name?: string;

  percent?: number;
}

export interface ISyncInstanceResV1 {
  is_sync_instance_success?: boolean;

  sync_error_message?: string;
}

export interface ISyncTaskTipsResV1 {
  db_types?: string[];

  source?: string;
}

export interface ISystemVariablesResV1 {
  url?: string;

  workflow_expired_hours?: number;
}

export interface ITable {
  name?: string;
}

export interface ITableColumns {
  head?: ITableMetaItemHeadResV1[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface ITableIndexes {
  head?: ITableMetaItemHeadResV1[];

  rows?: Array<{
    [key: string]: string;
  }>;
}

export interface ITableMeta {
  columns?: ITableColumns;

  create_table_sql?: string;

  indexes?: ITableIndexes;

  message?: string;

  name?: string;

  schema?: string;
}

export interface ITableMetaItemHeadResV1 {
  desc?: string;

  field_name?: string;
}

export interface ITestAuditPlanNotifyConfigResDataV1 {
  is_notify_send_normal?: boolean;

  send_error_message?: string;
}

export interface ITestAuditPlanNotifyConfigResV1 {
  code?: number;

  data?: ITestAuditPlanNotifyConfigResDataV1;

  message?: string;
}

export interface ITestDingTalkConfigResDataV1 {
  is_ding_talk_send_normal?: boolean;

  send_error_message?: string;
}

export interface ITestDingTalkConfigResV1 {
  code?: number;

  data?: ITestDingTalkConfigResDataV1;

  message?: string;
}

export interface ITestSMTPConfigurationReqV1 {
  recipient_addr?: string;
}

export interface ITestSMTPConfigurationResDataV1 {
  is_smtp_send_normal?: boolean;

  send_error_message?: string;
}

export interface ITestSMTPConfigurationResV1 {
  code?: number;

  data?: ITestSMTPConfigurationResDataV1;

  message?: string;
}

export interface ITestWeChatConfigurationReqV1 {
  recipient_id?: string;
}

export interface ITestWeChatConfigurationResDataV1 {
  is_wechat_send_normal?: boolean;

  send_error_message?: string;
}

export interface ITestWeChatConfigurationResV1 {
  code?: number;

  data?: ITestWeChatConfigurationResDataV1;

  message?: string;
}

export interface ITimeReqV1 {
  hour?: number;

  minute?: number;
}

export interface ITimeResV1 {
  hour?: number;

  minute?: number;
}

export interface ITriggerAuditPlanResV1 {
  code?: number;

  data?: IAuditPlanReportResV1;

  message?: string;
}

export interface ITriggerSyncInstanceResV1 {
  code?: number;

  data?: ISyncInstanceResV1;

  message?: string;
}

export interface IUpdateAuditPlanNotifyConfigReqV1 {
  enable_email_notify?: boolean;

  enable_web_hook_notify?: boolean;

  notify_interval?: number;

  notify_level?: UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum;

  web_hook_template?: string;

  web_hook_url?: string;
}

export interface IUpdateAuditPlanReqV1 {
  audit_plan_cron?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_params?: IAuditPlanParamReqV1[];

  rule_template_name?: string;
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

  wechat_id?: string;
}

export interface IUpdateDingTalkConfigurationReqV1 {
  app_key: string;

  app_secret: string;

  is_enable_ding_talk_notify: boolean;
}

export interface IUpdateInstanceReqV1 {
  additional_params?: IInstanceAdditionalParamReqV1[];

  db_host?: string;

  db_password?: string;

  db_port?: string;

  db_type?: string;

  db_user?: string;

  desc?: string;

  maintenance_times?: IMaintenanceTimeReqV1[];

  rule_template_name?: string;

  sql_query_config?: ISQLQueryConfigReqV1;
}

export interface IUpdateMemberGroupReqV1 {
  roles?: IBindRoleReqV1[];
}

export interface IUpdateMemberReqV1 {
  is_manager?: boolean;

  roles?: IBindRoleReqV1[];
}

export interface IUpdateOtherUserPasswordReqV1 {
  password?: string;
}

export interface IUpdateProjectReqV1 {
  desc?: string;
}

export interface IUpdateProjectRuleTemplateReqV1 {
  desc?: string;

  instance_name_list?: string[];

  rule_list?: IRuleReqV1[];
}

export interface IUpdateRoleReqV1 {
  is_disabled?: boolean;

  operation_code_list?: number[];

  role_desc?: string;
}

export interface IUpdateRuleTemplateReqV1 {
  desc?: string;

  rule_list?: IRuleReqV1[];
}

export interface IUpdateSMTPConfigurationReqV1 {
  enable_smtp_notify?: boolean;

  smtp_host?: string;

  smtp_password?: string;

  smtp_port?: string;

  smtp_username?: string;
}

export interface IUpdateSyncInstanceTaskReqV1 {
  global_rule_template?: string;

  sync_instance_interval?: string;

  url?: string;

  version?: string;
}

export interface IUpdateSystemVariablesReqV1 {
  url?: string;

  workflow_expired_hours?: number;
}

export interface IUpdateUserReqV1 {
  email?: string;

  is_disabled?: boolean;

  management_permission_code_list?: number[];

  phone?: string;

  user_group_name_list?: string[];

  wechat_id?: string;
}

export interface IUpdateWeChatConfigurationReqV1 {
  agent_id?: number;

  corp_id?: string;

  corp_secret?: string;

  enable_wechat_notify?: boolean;

  proxy_ip?: string;

  safe_enabled?: boolean;
}

export interface IUpdateWorkflowReqV1 {
  task_ids?: number[];
}

export interface IUpdateWorkflowScheduleReqV1 {
  schedule_time?: string;
}

export interface IUpdateWorkflowTemplateReqV1 {
  allow_submit_when_less_audit_level?: UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum;

  desc?: string;

  instance_name_list?: string[];

  workflow_step_template_list?: IWorkFlowStepTemplateReqV1[];
}

export interface IUserBindProjectResV1 {
  is_manager?: boolean;

  project_name?: string;
}

export interface IUserDetailResV1 {
  bind_projects?: IUserBindProjectResV1[];

  email?: string;

  is_admin?: boolean;

  is_disabled?: boolean;

  login_type?: string;

  management_permission_list?: IManagementPermissionResV1[];

  phone?: string;

  user_group_name_list?: string[];

  user_name?: string;

  wechat_id?: string;
}

export interface IUserGroupListItemResV1 {
  is_disabled?: boolean;

  user_group_desc?: string;

  user_group_name?: string;

  user_name_list?: string[];
}

export interface IUserGroupTipListItem {
  user_group_name?: string;

  user_names?: string[];
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

  is_disabled?: boolean;

  login_type?: string;

  management_permission_list?: IManagementPermissionResV1[];

  phone?: string;

  user_group_name_list?: string[];

  user_name?: string;

  wechat_id?: string;
}

export interface IUserTipResV1 {
  user_name?: string;
}

export interface IWeChatConfigurationResV1 {
  agent_id?: number;

  corp_id?: string;

  enable_wechat_notify?: boolean;

  proxy_ip?: string;

  safe_enabled?: boolean;
}

export interface IWorkFlowStepTemplateReqV1 {
  approved_by_authorized?: boolean;

  assignee_user_name_list?: string[];

  desc?: string;

  execute_by_authorized?: boolean;

  type?: WorkFlowStepTemplateReqV1TypeEnum;
}

export interface IWorkFlowStepTemplateResV1 {
  approved_by_authorized?: boolean;

  assignee_user_name_list?: string[];

  desc?: string;

  execute_by_authorized?: boolean;

  number?: number;

  type?: string;
}

export interface IWorkflowAuditPassPercentV1 {
  audit_pass_percent?: number;
}

export interface IWorkflowCountsV1 {
  today_count?: number;

  total?: number;
}

export interface IWorkflowCreatedCountsEachDayItem {
  date?: string;

  value?: number;
}

export interface IWorkflowCreatedCountsEachDayV1 {
  samples?: IWorkflowCreatedCountsEachDayItem[];
}

export interface IWorkflowDetailResV1 {
  create_time?: string;

  create_user_name?: string;

  current_step_assignee_user_name_list?: string[];

  current_step_type?: WorkflowDetailResV1CurrentStepTypeEnum;

  desc?: string;

  project_name?: string;

  status?: WorkflowDetailResV1StatusEnum;

  workflow_id?: string;

  workflow_name?: string;
}

export interface IWorkflowPassPercentV1 {
  audit_pass_percent?: number;

  execution_success_percent?: number;
}

export interface IWorkflowPercentCountedByInstanceType {
  count?: number;

  instance_type?: string;

  percent?: number;
}

export interface IWorkflowPercentCountedByInstanceTypeV1 {
  workflow_percents?: IWorkflowPercentCountedByInstanceType[];

  workflow_total_num?: number;
}

export interface IWorkflowRecordResV1 {
  current_step_number?: number;

  status?: WorkflowRecordResV1StatusEnum;

  tasks?: IWorkflowTaskItem[];

  workflow_step_list?: IWorkflowStepResV1[];
}

export interface IWorkflowRejectedPercentGroupByCreator {
  creator?: string;

  rejected_percent?: number;

  workflow_total_num?: number;
}

export interface IWorkflowRejectedPercentGroupByInstance {
  instance_name?: string;

  rejected_percent?: number;

  workflow_total_num?: number;
}

export interface IWorkflowResV1 {
  create_time?: string;

  create_user_name?: string;

  desc?: string;

  mode?: WorkflowResV1ModeEnum;

  record?: IWorkflowRecordResV1;

  record_history_list?: IWorkflowRecordResV1[];

  workflow_name?: string;
}

export interface IWorkflowStageDuration {
  minutes?: number;
}

export interface IWorkflowStatisticsResV1 {
  my_need_execute_workflow_number?: number;

  my_need_review_workflow_number?: number;

  my_on_process_workflow_number?: number;

  my_rejected_workflow_number?: number;

  need_me_to_execute_workflow_number?: number;

  need_me_to_review_workflow_number?: number;
}

export interface IWorkflowStatusCountV1 {
  closed_count?: number;

  executing_count?: number;

  executing_failed_count?: number;

  execution_success_count?: number;

  rejected_count?: number;

  waiting_for_audit_count?: number;

  waiting_for_execution_count?: number;
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

export interface IWorkflowTaskItem {
  task_id?: number;
}

export interface IWorkflowTemplateDetailResV1 {
  allow_submit_when_less_audit_level?: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum;

  desc?: string;

  instance_name_list?: string[];

  workflow_step_template_list?: IWorkFlowStepTemplateResV1[];

  workflow_template_name?: string;
}

export interface IAuditPlanResV2 {
  audit_plan_cron?: string;

  audit_plan_db_type?: string;

  audit_plan_instance_database?: string;

  audit_plan_instance_name?: string;

  audit_plan_meta?: IAuditPlanMetaV1;

  audit_plan_name?: string;

  audit_plan_token?: string;

  rule_template?: IRuleTemplateV2;
}

export interface IBatchCancelWorkflowsReqV2 {
  workflow_id_list?: string[];
}

export interface IBatchCompleteWorkflowsReqV2 {
  workflow_id_list?: string[];
}

export interface ICreateInstanceReqV2 {
  additional_params?: IInstanceAdditionalParamReqV1[];

  db_host?: string;

  db_password?: string;

  db_port?: string;

  db_type?: string;

  db_user?: string;

  desc?: string;

  instance_name?: string;

  maintenance_times?: IMaintenanceTimeReqV1[];

  rule_template_name?: string;

  sql_query_config?: ISQLQueryConfigReqV1;
}

export interface ICreateWorkflowReqV2 {
  desc?: string;

  task_ids?: number[];

  workflow_id?: string;

  workflow_subject?: string;
}

export interface IGetAuditPlansResV2 {
  code?: number;

  data?: IAuditPlanResV2[];

  message?: string;

  total_nums?: number;
}

export interface IGetInstancesResV2 {
  code?: number;

  data?: IInstanceResV2[];

  message?: string;

  total_nums?: number;
}

export interface IGetWorkflowResV2 {
  code?: number;

  data?: IWorkflowResV2;

  message?: string;
}

export interface IGetWorkflowTasksItemV2 {
  current_step_assignee_user_name_list?: string[];

  exec_end_time?: string;

  exec_start_time?: string;

  execution_user_name?: string;

  instance_maintenance_times?: IMaintenanceTimeResV1[];

  instance_name?: string;

  schedule_time?: string;

  status?: GetWorkflowTasksItemV2StatusEnum;

  task_id?: number;

  task_pass_rate?: number;

  task_score?: number;
}

export interface IGetWorkflowTasksResV2 {
  code?: number;

  data?: IGetWorkflowTasksItemV2[];

  message?: string;
}

export interface IInstanceResV2 {
  additional_params?: IInstanceAdditionalParamResV1[];

  db_host?: string;

  db_port?: string;

  db_type?: string;

  db_user?: string;

  desc?: string;

  instance_name?: string;

  maintenance_times?: IMaintenanceTimeResV1[];

  rule_template?: IRuleTemplateV2;

  source?: string;

  sql_query_config?: ISQLQueryConfigResV1;
}

export interface IRejectWorkflowReqV2 {
  reason?: string;
}

export interface IRuleTemplateV2 {
  is_global_rule_template?: boolean;

  name?: string;
}

export interface IUpdateWorkflowReqV2 {
  task_ids?: number[];
}

export interface IUpdateWorkflowScheduleReqV2 {
  schedule_time?: string;
}

export interface IWorkflowRecordResV2 {
  current_step_number?: number;

  status?: WorkflowRecordResV2StatusEnum;

  tasks?: IWorkflowTaskItem[];

  workflow_step_list?: IWorkflowStepResV2[];
}

export interface IWorkflowResV2 {
  create_time?: string;

  create_user_name?: string;

  desc?: string;

  mode?: WorkflowResV2ModeEnum;

  record?: IWorkflowRecordResV2;

  record_history_list?: IWorkflowRecordResV2[];

  workflow_id?: string;

  workflow_name?: string;
}

export interface IWorkflowStepResV2 {
  assignee_user_name_list?: string[];

  desc?: string;

  number?: number;

  operation_time?: string;

  operation_user_name?: string;

  reason?: string;

  state?: WorkflowStepResV2StateEnum;

  type?: WorkflowStepResV2TypeEnum;

  workflow_step_id?: number;
}
