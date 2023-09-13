import {
  getAuditTaskSQLsV1FilterAuditStatusEnum,
  getAuditTaskSQLsV2FilterExecStatusEnum,
} from '../../api/task/index.enum';
import { getWorkflowsV1FilterStatusEnum } from '../../api/workflow/index.enum';
import { StaticEnumDictionary } from './index.type';
import {
  AuditPlanReportResV1AuditLevelEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
  RuleResV1LevelEnum,
} from '../../api/common.enum';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '../../api/sql_audit_record/index.enum';

export const execStatusDictionary: StaticEnumDictionary<getAuditTaskSQLsV2FilterExecStatusEnum> =
  {
    [getAuditTaskSQLsV2FilterExecStatusEnum.initialized]:
      'audit.execStatus.initialized',
    [getAuditTaskSQLsV2FilterExecStatusEnum.doing]: 'audit.execStatus.doing',
    [getAuditTaskSQLsV2FilterExecStatusEnum.failed]: 'audit.execStatus.failed',
    [getAuditTaskSQLsV2FilterExecStatusEnum.succeeded]:
      'audit.execStatus.succeeded',
    [getAuditTaskSQLsV2FilterExecStatusEnum.manually_executed]:
      'audit.execStatus.manually_executed',
    [getAuditTaskSQLsV2FilterExecStatusEnum.terminate_failed]:
      'audit.execStatus.terminate_failed',
    [getAuditTaskSQLsV2FilterExecStatusEnum.terminate_succeeded]:
      'audit.execStatus.terminate_succeeded',
    [getAuditTaskSQLsV2FilterExecStatusEnum.terminating]:
      'audit.execStatus.terminating',
  };

export const auditStatusDictionary: StaticEnumDictionary<getAuditTaskSQLsV1FilterAuditStatusEnum> =
  {
    [getAuditTaskSQLsV1FilterAuditStatusEnum.initialized]:
      'audit.auditStatus.initialized',
    [getAuditTaskSQLsV1FilterAuditStatusEnum.doing]: 'audit.auditStatus.doing',
    [getAuditTaskSQLsV1FilterAuditStatusEnum.finished]:
      'audit.auditStatus.finished',
  };

export const orderStatusDictionary: StaticEnumDictionary<getWorkflowsV1FilterStatusEnum> =
  {
    [getWorkflowsV1FilterStatusEnum.wait_for_audit]:
      'order.status.wait_for_audit',
    [getWorkflowsV1FilterStatusEnum.wait_for_execution]:
      'order.status.wait_for_execution',
    [getWorkflowsV1FilterStatusEnum.canceled]: 'order.status.canceled',
    [getWorkflowsV1FilterStatusEnum.rejected]: 'order.status.reject',
    [getWorkflowsV1FilterStatusEnum.exec_failed]: 'order.status.exec_failed',
    [getWorkflowsV1FilterStatusEnum.finished]: 'order.status.finished',
    [getWorkflowsV1FilterStatusEnum.executing]: 'order.status.executing',
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

export const auditLevelDictionary: StaticEnumDictionary<WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum> =
  {
    [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal]:
      'workflowTemplate.auditLevel.normal',
    [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.notice]:
      'workflowTemplate.auditLevel.notice',
    [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn]:
      'workflowTemplate.auditLevel.warn',
    [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error]:
      'workflowTemplate.auditLevel.error',
  };

export const auditResultRecordFilterStatusEnum: StaticEnumDictionary<getSQLAuditRecordsV1FilterSqlAuditStatusEnum> =
  {
    [getSQLAuditRecordsV1FilterSqlAuditStatusEnum.auditing]:
      'sqlAudit.list.auditing',
    [getSQLAuditRecordsV1FilterSqlAuditStatusEnum.successfully]:
      'sqlAudit.list.successfully',
  };
