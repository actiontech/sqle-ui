import { Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAuditTaskSQLsV1FilterAuditStatusEnum,
  getAuditTaskSQLsV1FilterExecStatusEnum,
} from '../../api/task/index.enum';

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

  return {
    generateAuditStatusSelectOption,
    generateExecStatusSelectOption,
  };
};

export default useStaticStatus;
