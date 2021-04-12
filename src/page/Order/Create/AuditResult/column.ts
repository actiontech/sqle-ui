import { IAuditTaskSQLResV1 } from '../../../../api/common';
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
      dataIndex: 'audit_level',
      title: () => i18n.t('audit.table.auditLevel'),
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
      dataIndex: 'rollback_sql',
      title: () => i18n.t('audit.table.rollback'),
    },
  ];
};
