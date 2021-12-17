import {
  getAuditTaskSQLsV1FilterAuditStatusEnum,
  getAuditTaskSQLsV1FilterExecStatusEnum,
} from '../../api/task/index.enum';
import {
  getWorkflowListV1FilterCurrentStepTypeEnum,
  getWorkflowListV1FilterStatusEnum,
} from '../../api/workflow/index.enum';
import { StaticEnumDictionary } from './index.type';
import { RuleResV1LevelEnum } from '../../api/common.enum';

export const WorkflowStepTypeDictionary: StaticEnumDictionary<getWorkflowListV1FilterCurrentStepTypeEnum> =
  {
    [getWorkflowListV1FilterCurrentStepTypeEnum.sql_review]:
      'order.workflowStatus.review',
    [getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute]:
      'order.workflowStatus.exec',
  };

export const execStatusDictionary: StaticEnumDictionary<getAuditTaskSQLsV1FilterExecStatusEnum> =
  {
    [getAuditTaskSQLsV1FilterExecStatusEnum.initialized]:
      'audit.execStatus.initialized',
    [getAuditTaskSQLsV1FilterExecStatusEnum.doing]: 'audit.execStatus.doing',
    [getAuditTaskSQLsV1FilterExecStatusEnum.failed]: 'audit.execStatus.failed',
    [getAuditTaskSQLsV1FilterExecStatusEnum.succeeded]:
      'audit.execStatus.succeeded',
  };

export const auditStatusDictionary: StaticEnumDictionary<getAuditTaskSQLsV1FilterAuditStatusEnum> =
  {
    [getAuditTaskSQLsV1FilterAuditStatusEnum.initialized]:
      'audit.auditStatus.initialized',
    [getAuditTaskSQLsV1FilterAuditStatusEnum.doing]: 'audit.auditStatus.doing',
    [getAuditTaskSQLsV1FilterAuditStatusEnum.finished]:
      'audit.auditStatus.finished',
  };

export const orderStatusDictionary: StaticEnumDictionary<getWorkflowListV1FilterStatusEnum> =
  {
    [getWorkflowListV1FilterStatusEnum.on_process]: 'order.status.process',
    [getWorkflowListV1FilterStatusEnum.finished]: 'order.status.finished',
    [getWorkflowListV1FilterStatusEnum.canceled]: 'order.status.canceled',
    [getWorkflowListV1FilterStatusEnum.rejected]: 'order.status.reject',
    [getWorkflowListV1FilterStatusEnum.exec_scheduled]:
      'order.status.exec_scheduled',
    [getWorkflowListV1FilterStatusEnum.exec_failed]: 'order.status.exec_failed',
    [getWorkflowListV1FilterStatusEnum.executing]: 'order.status.executing',
  };

export const ruleLevelDictionary: StaticEnumDictionary<RuleResV1LevelEnum> = {
  [RuleResV1LevelEnum.normal]: 'ruleTemplate.ruleLevel.normal',
  [RuleResV1LevelEnum.notice]: 'ruleTemplate.ruleLevel.notice',
  [RuleResV1LevelEnum.warn]: 'ruleTemplate.ruleLevel.warn',
  [RuleResV1LevelEnum.error]: 'ruleTemplate.ruleLevel.error',
};
