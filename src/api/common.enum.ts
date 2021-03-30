export enum AuditTaskResV1StatusEnum {
  'initialized' = 'initialized',

  'audited' = 'audited',

  'executing' = 'executing',

  'exec_success' = 'exec_success',

  'exec_failed' = 'exec_failed'
}

export enum RuleResV1LevelEnum {
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
  'on_process' = 'on_process',

  'finished' = 'finished',

  'rejected' = 'rejected',

  'canceled' = 'canceled'
}

export enum WorkflowDetailResV1TaskStatusEnum {
  'initialized' = 'initialized',

  'audited' = 'audited',

  'executing' = 'executing',

  'exec_success' = 'exec_success',

  'exec_failed' = 'exec_failed'
}

export enum WorkflowResV1StatusEnum {
  'on_process' = 'on_process',

  'finished' = 'finished',

  'rejected' = 'rejected',

  'canceled' = 'canceled'
}

export enum WorkflowStepResV1StateEnum {
  'initialized' = 'initialized',

  'approved' = 'approved',

  'rejected' = 'rejected'
}
