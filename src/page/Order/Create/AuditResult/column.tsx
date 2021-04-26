import React from 'react';
import { IAuditTaskSQLResV1 } from '../../../../api/common';
import { getAuditTaskSQLsV1FilterAuditStatusEnum } from '../../../../api/task/index.enum';
import AuditResultErrorMessage from '../../../../components/AuditResultErrorMessage';
import { auditStatusDictionary } from '../../../../hooks/useStaticStatus/index.data';
import i18n from '../../../../locale';
import { TableColumn } from '../../../../types/common.type';

export const auditResultColumn = (): TableColumn<IAuditTaskSQLResV1> => {
  return [
    {
      dataIndex: 'number',
      title: () => i18n.t('audit.table.number'),
    },
    {
      dataIndex: 'exec_sql',
      title: () => i18n.t('audit.table.execSql'),
    },
    {
      dataIndex: 'audit_status',
      title: () => i18n.t('audit.table.auditStatus'),
      render: (status: getAuditTaskSQLsV1FilterAuditStatusEnum) => {
        return status ? i18n.t(auditStatusDictionary[status]) : '';
      },
    },
    {
      dataIndex: 'audit_result',
      title: () => i18n.t('audit.table.auditResult'),
      render: (errorMessage) => {
        return <AuditResultErrorMessage resultErrorMessage={errorMessage} />;
      },
    },
    {
      dataIndex: 'rollback_sql',
      title: () => i18n.t('audit.table.rollback'),
    },
  ];
};
