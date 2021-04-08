import { IAuditTaskSQLResV1 } from '../../../../api/common';
import i18n from '../../../../locale';
import { TableColumn } from '../../../../types/common.type';

export const orderAuditResultColumn = (): TableColumn<IAuditTaskSQLResV1> => {
  return [
    {
      dataIndex: 'number',
      title: () => i18n.t('audit.table.number'),
    },
    {
      dataIndex: 'audit_status',
      title: () => i18n.t('audit.table.auditStatus'),
    },
    {
      dataIndex: 'audit_result',
      title: () => i18n.t('audit.table.auditResult'),
    },
    {
      dataIndex: 'exec_sql',
      title: () => i18n.t('audit.table.execSql'),
    },
    {
      dataIndex: 'exec_status',
      title: () => i18n.t('audit.table.execStatus'),
    },
    {
      dataIndex: 'exec_result',
      title: () => i18n.t('audit.table.execResult'),
    },
    {
      dataIndex: 'rollback_sql',
      title: () => i18n.t('audit.table.rollback'),
    },
  ];
};
