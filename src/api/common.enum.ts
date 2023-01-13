export enum AuditPlanParamResV1TypeEnum {
  'string' = 'string',

  'int' = 'int',

  'bool' = 'bool'
}

export enum AuditPlanReportResV1AuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error',

  'UNKNOWN' = ''
}

export enum AuditPlanSQLHeadV1TypeEnum {
  'sql' = 'sql'
}

export enum AuditPlanTypesV1InstanceTypeEnum {
  'MySQL' = 'MySQL',

  'Oracle' = 'Oracle',

  'TiDB' = 'TiDB',

  'OceanBase For MySQL' = 'OceanBase For MySQL',

  'UNKNOWN' = ''
}

export enum AuditResDataV1AuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error',

  'UNKNOWN' = ''
}

export enum AuditTaskResV1AuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error',

  'UNKNOWN' = ''
}

export enum AuditTaskResV1SqlSourceEnum {
  'form_data' = 'form_data',

  'sql_file' = 'sql_file',

  'mybatis_xml_file' = 'mybatis_xml_file',

  'audit_plan' = 'audit_plan'
}

export enum AuditTaskResV1StatusEnum {
  'initialized' = 'initialized',

  'audited' = 'audited',

  'executing' = 'executing',

  'exec_success' = 'exec_success',

  'exec_failed' = 'exec_failed',

  'manually_executed' = 'manually_executed'
}

export enum CreateAuditWhitelistReqV1MatchTypeEnum {
  'exact_match' = 'exact_match',

  'fp_match' = 'fp_match'
}

export enum DirectAuditReqV1SqlTypeEnum {
  'sql' = 'sql',

  'mybatis' = 'mybatis',

  'UNKNOWN' = ''
}

export enum GetWorkflowTasksItemV1StatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'exec_scheduled' = 'exec_scheduled',

  'exec_failed' = 'exec_failed',

  'exec_succeeded' = 'exec_succeeded',

  'executing' = 'executing',

  'manually_executed' = 'manually_executed'
}

export enum InstanceTaskResV1LastSyncStatusEnum {
  'success' = 'success',

  'fail' = 'fail'
}

export enum RuleParamResV1TypeEnum {
  'string' = 'string',

  'int' = 'int',

  'bool' = 'bool'
}

export enum RuleResV1LevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum SQLQueryConfigResV1AllowQueryWhenLessThanAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum UpdateAuditWhitelistReqV1MatchTypeEnum {
  'exact_match' = 'exact_match',

  'fp_match' = 'fp_match'
}

export enum UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum WorkFlowStepTemplateReqV1TypeEnum {
  'sql_review' = 'sql_review',

  'sql_execute' = 'sql_execute'
}

export enum WorkflowDetailResV1CurrentStepTypeEnum {
  'sql_review' = 'sql_review',

  'sql_execute' = 'sql_execute'
}

export enum WorkflowDetailResV1StatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'executing' = 'executing',

  'finished' = 'finished'
}

export enum WorkflowRecordResV1StatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'executing' = 'executing',

  'finished' = 'finished'
}

export enum WorkflowResV1ModeEnum {
  'same_sqls' = 'same_sqls',

  'different_sqls' = 'different_sqls'
}

export enum WorkflowStepResV1StateEnum {
  'initialized' = 'initialized',

  'approved' = 'approved',

  'rejected' = 'rejected'
}

export enum WorkflowStepResV1TypeEnum {
  'create_workflow' = 'create_workflow',

  'update_workflow' = 'update_workflow',

  'sql_review' = 'sql_review',

  'sql_execute' = 'sql_execute'
}

export enum WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}
