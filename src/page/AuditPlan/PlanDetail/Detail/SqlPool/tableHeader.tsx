import { IAuditPlanSQLResV1 } from '../../../../../api/common';
import i18n from '../../../../../locale';
import { TableColumn } from '../../../../../types/common.type';
import { formatTime } from '../../../../../utils/Common';
import HighlightCode from '../../../../../utils/HighlightCode';

export const SqlPoolTableHeader = (): TableColumn<IAuditPlanSQLResV1> => {
  return [
    {
      dataIndex: 'audit_plan_sql_fingerprint',
      title: () => i18n.t('auditPlan.sqlPool.table.fingerprint'),
      render: (sql) => {
        if (!!sql) {
          return (
            <pre
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(sql),
              }}
              className="pre-warp-break-all"
            ></pre>
          );
        }
        return null;
      },
    },
    {
      dataIndex: 'audit_plan_sql_last_receive_text',
      title: () => i18n.t('auditPlan.sqlPool.table.lastReceiveText'),
      render: (sql) => {
        if (!!sql) {
          return (
            <pre
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(sql),
              }}
              className="pre-warp-break-all"
            ></pre>
          );
        }
        return null;
      },
    },
    {
      dataIndex: 'audit_plan_sql_counter',
      title: () => i18n.t('auditPlan.sqlPool.table.count'),
    },
    {
      dataIndex: 'audit_plan_sql_last_receive_timestamp',
      title: () => i18n.t('auditPlan.sqlPool.table.lastReceiveTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
  ];
};
