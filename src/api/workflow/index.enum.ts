/* tslint:disable no-duplicate-string */

export enum getWorkflowListV1FilterCurrentStepTypeEnum {
  'sql_review' = 'sql_review',

  'sql_execute' = 'sql_execute'
}

export enum getWorkflowListV1FilterStatusEnum {
  'on_process' = 'on_process',

  'finished' = 'finished',

  'rejected' = 'rejected',

  'canceled' = 'canceled'
}

export enum getWorkflowListV1FilterTaskStatusEnum {
  'initialized' = 'initialized',

  'audited' = 'audited',

  'executing' = 'executing',

  'exec_succeeded' = 'exec_succeeded',

  'exec_failed' = 'exec_failed'
}
