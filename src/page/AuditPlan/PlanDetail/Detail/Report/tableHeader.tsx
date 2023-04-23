import { Typography } from 'antd';
import { IAuditPlanReportSQLResV1 } from '../../../../../api/common';
import AuditResultErrorMessage from '../../../../../components/AuditResultErrorMessage';
import { t } from '../../../../../locale';
import { TableColumn } from '../../../../../types/common.type';
import HighlightCode from '../../../../../utils/HighlightCode';

export const AuditPlanReportTableHeader = (
  clickAnalyze: (sqlNum: number) => void
): TableColumn<IAuditPlanReportSQLResV1, 'operator'> => {
  return [
    {
      dataIndex: 'audit_plan_report_sql',
      title: () => t('auditPlan.report.table.sql'),
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
      title: () => t('auditPlan.report.table.result'),
      render: (result) => {
        return <AuditResultErrorMessage resultErrorMessage={result} />;
      },
    },
    /* IFTRUE_isEE */
    {
      dataIndex: 'operator',
      title: () => t('common.operate'),
      width: 75,
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => clickAnalyze(record.number ?? 0)}>
            {t('auditPlan.report.table.analyze')}
          </Typography.Link>
        );
      },
    },
    /* FITRUE_isEE */
  ];
};
