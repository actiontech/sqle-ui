import { IAuditPlanReportSQLResV2 } from '../../../../../api/common';
import AuditResultErrorMessage from '../../../../../components/AuditResultErrorMessage';
import i18n from '../../../../../locale';
import { TableColumn } from '../../../../../types/common.type';
import HighlightCode from '../../../../../utils/HighlightCode';

export const AuditPlanReportTableHeader =
  (): TableColumn<IAuditPlanReportSQLResV2> => {
    return [
      {
        dataIndex: 'audit_plan_report_sql',
        title: () => i18n.t('auditPlan.report.table.sql'),
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
    ];
  };
