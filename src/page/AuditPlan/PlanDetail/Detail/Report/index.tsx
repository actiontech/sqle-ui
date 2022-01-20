import { useRequest } from 'ahooks';
import { Card, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import audit_plan from '../../../../../api/audit_plan';
import useTable from '../../../../../hooks/useTable';
import { AuditPlanReportUrlParams } from './index.type';
import { AuditPlanReportTableHeader } from './tableHeader';

const AuditPlanReport: React.FC = () => {
  const { t } = useTranslation();
  const urlParams = useParams<AuditPlanReportUrlParams>();
  const { pagination, tableChange } = useTable();

  const { data, loading } = useRequest(
    () =>
      audit_plan.getAuditPlanReportSQLsV2({
        audit_plan_name: urlParams.auditPlanName,
        audit_plan_report_id: urlParams.reportId,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
      }),
    {
      ready: !!urlParams.auditPlanName && !!urlParams.reportId,
      refreshDeps: [pagination, urlParams.auditPlanName, urlParams.reportId],
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      },
    }
  );

  return (
    <Card title={t('auditPlan.report.title', { id: urlParams.reportId })}>
      <Table
        rowKey="audit_plan_report_sql"
        loading={loading}
        dataSource={data?.list ?? []}
        columns={AuditPlanReportTableHeader()}
        pagination={{
          showSizeChanger: true,
          total: data?.total ?? 0,
        }}
        onChange={tableChange}
      />
    </Card>
  );
};

export default AuditPlanReport;
