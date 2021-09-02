import { IAuditPlanReportSQLResV1 } from '../../../../../api/common';
import AuditResultErrorMessage from '../../../../../components/AuditResultErrorMessage';
import i18n from '../../../../../locale';
import { TableColumn } from '../../../../../types/common.type';
import { formatTime } from '../../../../../utils/Common';
import HighlightCode from '../../../../../utils/HighlightCode';

export const AuditPlanReportTableHeader =
  (): TableColumn<IAuditPlanReportSQLResV1> => {
    return [
      {
        dataIndex: 'audit_plan_report_sql_fingerprint',
        title: () => i18n.t('auditPlan.report.table.fingerprint'),
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
        dataIndex: 'audit_plan_report_sql_audit_result',
        title: () => i18n.t('auditPlan.report.table.result'),
        render: (result) => {
          return <AuditResultErrorMessage resultErrorMessage={result} />;
        },
      },
      {
        dataIndex: 'audit_plan_report_sql_last_receive_text',
        title: () => i18n.t('auditPlan.report.table.lastReceiveText'),
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
        dataIndex: 'audit_plan_report_sql_last_receive_timestamp',
        title: () => i18n.t('auditPlan.report.table.lastReceiveTime'),
        render: (time) => formatTime(time),
      },
    ];
  };
