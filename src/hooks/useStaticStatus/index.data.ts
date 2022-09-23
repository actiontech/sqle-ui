import {
  getAuditTaskSQLsV1FilterAuditStatusEnum,
  getAuditTaskSQLsV1FilterExecStatusEnum,
} from '../../api/task/index.enum';
import {
  getWorkflowListV1FilterCurrentStepTypeEnum,
  getWorkflowsV2FilterStatusEnum,
} from '../../api/workflow/index.enum';
import { StaticEnumDictionary } from './index.type';
import {
  AuditPlanReportResV1AuditLevelEnum,
  CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  RuleResV1LevelEnum,
} from '../../api/common.enum';

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

export const orderStatusDictionary: StaticEnumDictionary<getWorkflowsV2FilterStatusEnum> =
  {
    [getWorkflowsV2FilterStatusEnum.wait_for_audit]:
      'order.status.wait_for_audit',
    [getWorkflowsV2FilterStatusEnum.wait_for_execution]:
      'order.status.wait_for_execution',
    [getWorkflowsV2FilterStatusEnum.canceled]: 'order.status.canceled',
    [getWorkflowsV2FilterStatusEnum.rejected]: 'order.status.reject',
    [getWorkflowsV2FilterStatusEnum.exec_failed]: 'order.status.exec_failed',
    [getWorkflowsV2FilterStatusEnum.finished]: 'order.status.finished',
    [getWorkflowsV2FilterStatusEnum.executing]: 'order.status.executing',
  };

export const ruleLevelDictionary: StaticEnumDictionary<RuleResV1LevelEnum> = {
  [RuleResV1LevelEnum.normal]: 'ruleTemplate.ruleLevel.normal',
  [RuleResV1LevelEnum.notice]: 'ruleTemplate.ruleLevel.notice',
  [RuleResV1LevelEnum.warn]: 'ruleTemplate.ruleLevel.warn',
  [RuleResV1LevelEnum.error]: 'ruleTemplate.ruleLevel.error',
};

export const auditPlanRuleLevelDictionary: StaticEnumDictionary<AuditPlanReportResV1AuditLevelEnum> =
  {
    [AuditPlanReportResV1AuditLevelEnum.normal]:
      'ruleTemplate.ruleLevel.normal',
    [AuditPlanReportResV1AuditLevelEnum.notice]:
      'ruleTemplate.ruleLevel.notice',
    [AuditPlanReportResV1AuditLevelEnum.warn]: 'ruleTemplate.ruleLevel.warn',
    [AuditPlanReportResV1AuditLevelEnum.error]: 'ruleTemplate.ruleLevel.error',
    [AuditPlanReportResV1AuditLevelEnum.UNKNOWN]:
      'ruleTemplate.ruleLevel.unknown',
  };

export const auditLevelDictionary: StaticEnumDictionary<CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum> =
  {
    [CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal]:
      'workflowTemplate.auditLevel.normal',
    [CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.notice]:
      'workflowTemplate.auditLevel.notice',
    [CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn]:
      'workflowTemplate.auditLevel.warn',
    [CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error]:
      'workflowTemplate.auditLevel.error',
  };
