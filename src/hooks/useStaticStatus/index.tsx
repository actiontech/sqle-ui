import { Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAuditTaskSQLsV1FilterAuditStatusEnum,
  getAuditTaskSQLsV1FilterExecStatusEnum,
} from '../../api/task/index.enum';
import {
  getWorkflowListV1FilterCurrentStepTypeEnum,
  getWorkflowListV1FilterStatusEnum,
  getWorkflowListV1FilterTaskStatusEnum,
} from '../../api/workflow/index.enum';

const useStaticStatus = () => {
  const { t } = useTranslation();

  const generateExecStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          value={getAuditTaskSQLsV1FilterExecStatusEnum.initialized}
          key={getAuditTaskSQLsV1FilterExecStatusEnum.initialized}
        >
          {t('audit.execStatus.initialized')}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterExecStatusEnum.doing}
          key={getAuditTaskSQLsV1FilterExecStatusEnum.doing}
        >
          {t('audit.execStatus.doing')}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterExecStatusEnum.succeeded}
          key={getAuditTaskSQLsV1FilterExecStatusEnum.succeeded}
        >
          {t('audit.execStatus.succeeded')}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterExecStatusEnum.failed}
          key={getAuditTaskSQLsV1FilterExecStatusEnum.failed}
        >
          {t('audit.execStatus.failed')}
        </Select.Option>
      </>
    );
  }, [t]);

  const generateAuditStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          value={getAuditTaskSQLsV1FilterAuditStatusEnum.initialized}
          key={getAuditTaskSQLsV1FilterAuditStatusEnum.initialized}
        >
          {t('audit.auditStatus.initialized')}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterAuditStatusEnum.doing}
          key={getAuditTaskSQLsV1FilterAuditStatusEnum.doing}
        >
          {t('audit.auditStatus.doing')}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterAuditStatusEnum.finished}
          key={getAuditTaskSQLsV1FilterAuditStatusEnum.finished}
        >
          {t('audit.auditStatus.finished')}
        </Select.Option>
      </>
    );
  }, [t]);

  const generateWorkflowStepTypeSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          key={getWorkflowListV1FilterCurrentStepTypeEnum.sql_review}
          value={getWorkflowListV1FilterCurrentStepTypeEnum.sql_review}
        >
          {t('order.workflowStatus.review')}
        </Select.Option>
        <Select.Option
          key={getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute}
          value={getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute}
        >
          {t('order.workflowStatus.exec')}
        </Select.Option>
      </>
    );
  }, [t]);

  const generateOrderStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          key={getWorkflowListV1FilterStatusEnum.on_process}
          value={getWorkflowListV1FilterStatusEnum.on_process}
        >
          {t('order.status.process')}
        </Select.Option>
        <Select.Option
          key={getWorkflowListV1FilterStatusEnum.finished}
          value={getWorkflowListV1FilterStatusEnum.finished}
        >
          {t('order.status.finished')}
        </Select.Option>
        <Select.Option
          key={getWorkflowListV1FilterStatusEnum.rejected}
          value={getWorkflowListV1FilterStatusEnum.rejected}
        >
          {t('order.status.reject')}
        </Select.Option>
        <Select.Option
          key={getWorkflowListV1FilterStatusEnum.canceled}
          value={getWorkflowListV1FilterStatusEnum.canceled}
        >
          {t('order.status.canceled')}
        </Select.Option>
      </>
    );
  }, [t]);

  const generateSqlTaskStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          key={getWorkflowListV1FilterTaskStatusEnum.initialized}
          value={getWorkflowListV1FilterTaskStatusEnum.initialized}
        >
          {t('order.sqlTaskStatus.initialized')}
        </Select.Option>
        <Select.Option
          key={getWorkflowListV1FilterTaskStatusEnum.audited}
          value={getWorkflowListV1FilterTaskStatusEnum.audited}
        >
          {t('order.sqlTaskStatus.audited')}
        </Select.Option>
        <Select.Option
          key={getWorkflowListV1FilterTaskStatusEnum.executing}
          value={getWorkflowListV1FilterTaskStatusEnum.executing}
        >
          {t('order.sqlTaskStatus.executing')}
        </Select.Option>
        <Select.Option
          key={getWorkflowListV1FilterTaskStatusEnum.exec_success}
          value={getWorkflowListV1FilterTaskStatusEnum.exec_success}
        >
          {t('order.sqlTaskStatus.execSuccess')}
        </Select.Option>
        <Select.Option
          key={getWorkflowListV1FilterTaskStatusEnum.exec_failed}
          value={getWorkflowListV1FilterTaskStatusEnum.exec_failed}
        >
          {t('order.sqlTaskStatus.execFailed')}
        </Select.Option>
      </>
    );
  }, [t]);

  return {
    generateAuditStatusSelectOption,
    generateExecStatusSelectOption,
    generateWorkflowStepTypeSelectOption,
    generateOrderStatusSelectOption,
    generateSqlTaskStatusSelectOption,
  };
};

export default useStaticStatus;
