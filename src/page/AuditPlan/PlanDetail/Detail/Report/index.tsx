import { useRequest } from 'ahooks';
import { Card, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import audit_plan from '../../../../../api/audit_plan';
import useTable from '../../../../../hooks/useTable';
import { formatTime } from '../../../../../utils/Common';
import { useCurrentProjectName } from '../../../../ProjectManage/ProjectDetail';
import { AuditPlanReportUrlParams } from './index.type';
import { AuditPlanReportTableHeader } from './tableHeader';

const AuditPlanReport: React.FC = () => {
  const { t } = useTranslation();
  const urlParams = useParams<AuditPlanReportUrlParams>();
  const { pagination, tableChange } = useTable();
  const { projectName } = useCurrentProjectName();

  const { data: reportInfo } = useRequest(() =>
    audit_plan
      .getAuditPlanReportV1({
        audit_plan_report_id: urlParams.reportId ?? '',
        audit_plan_name: urlParams.auditPlanName ?? '',
        project_name: projectName,
      })
      .then((res) => res.data?.data ?? {})
  );

  const { data, loading } = useRequest(
    () =>
      audit_plan
        .getAuditPlanReportsSQLsV1({
          project_name: projectName,
          audit_plan_name: urlParams.auditPlanName ?? '',
          audit_plan_report_id: urlParams.reportId ?? '',
          page_index: pagination.pageIndex,
          page_size: pagination.pageSize,
        })
        .then((res) => {
          return {
            list: res.data?.data ?? [],
            total: res.data?.total_nums ?? 0,
          };
        }),
    {
      ready: !!urlParams.auditPlanName && !!urlParams.reportId,
      refreshDeps: [pagination, urlParams.auditPlanName, urlParams.reportId],
    }
  );

  const handleClickAnalyze = (sqlNumber: number) => {
    window.open(
      `/project/${projectName}/auditPlan/${urlParams.reportId}/${sqlNumber}/${urlParams.auditPlanName}/analyze`
    );
  };

  return (
    <Card
      title={
        <>
          {t('auditPlan.report.time', {
            time: formatTime(reportInfo?.audit_plan_report_timestamp, '--'),
          })}
          &nbsp;
          <Typography.Text type="secondary" className="font-size-small">
            {t('auditPlan.report.source', {
              source: reportInfo?.score ?? '--',
            })}
            &nbsp;
            {t('auditPlan.report.passRage', {
              rage: reportInfo?.pass_rate ?? '--',
            })}
          </Typography.Text>
        </>
      }
    >
      <Table
        rowKey="audit_plan_report_sql"
        loading={loading}
        dataSource={data?.list ?? []}
        columns={AuditPlanReportTableHeader(handleClickAnalyze)}
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
