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

  'exec_failed' = 'exec_failed'
}

export enum CreateAuditWhitelistReqV1MatchTypeEnum {
  'exact_match' = 'exact_match',

  'fp_match' = 'fp_match'
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

export enum UpdateAuditWhitelistReqV1MatchTypeEnum {
  'exact_match' = 'exact_match',

  'fp_match' = 'fp_match'
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
  'on_process' = 'on_process',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_scheduled' = 'exec_scheduled',

  'executing' = 'executing',

  'exec_failed' = 'exec_failed',

  'finished' = 'finished'
}

export enum WorkflowRecordResV1StatusEnum {
  'on_process' = 'on_process',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_scheduled' = 'exec_scheduled',

  'executing' = 'executing',

  'exec_failed' = 'exec_failed',

  'finished' = 'finished'
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
