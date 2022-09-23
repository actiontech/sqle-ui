/* tslint:disable no-duplicate-string */

export enum getWorkflowListV1FilterCurrentStepTypeEnum {
  'sql_review' = 'sql_review',

  'sql_execute' = 'sql_execute'
}

export enum getWorkflowListV1FilterStatusEnum {
  'on_process' = 'on_process',

  'rejected' = 'rejected',

  'canceled' = 'canceled',

  'exec_scheduled' = 'exec_scheduled',

  'executing' = 'executing',

  'exec_failed' = 'exec_failed',

  'finished' = 'finished'
}

export enum getWorkflowsV2FilterStatusEnum {
  'wait_for_audit' = 'wait_for_audit',

  'wait_for_execution' = 'wait_for_execution',

  'rejected' = 'rejected',

  'executing' = 'executing',

  'canceled' = 'canceled',

  'exec_failed' = 'exec_failed',

  'finished' = 'finished'
}
