import { useRequest } from 'ahooks';
import { PageHeader, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import audit_plan from '../../../api/audit_plan';
import BackButton from '../../../components/BackButton';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import PlanDetail from './Detail';
import { PlanDetailUrlParams } from './index.type';
import { useTheme } from '@mui/styles';

const PlanDetailPage = () => {
  const urlParams = useParams<PlanDetailUrlParams>();
  const theme = useTheme();
  const { projectName } = useCurrentProjectName();
  const { t } = useTranslation();
  const { data: auditTask } = useRequest(() => {
    return audit_plan
      .getAuditPlanV1({
        audit_plan_name: urlParams.auditPlanName ?? '',
        project_name: projectName,
      })
      .then((res) => res.data);
  });

  return (
    <>
      <PageHeader
        ghost={false}
        title={t('auditPlan.detailPage.pageTitle', {
          name: urlParams.auditPlanName,
        })}
        extra={[<BackButton key="goBack" />]}
        style={{ marginBottom: theme.common.padding }}
      >
        <Typography.Paragraph>
          {t('auditPlan.detailPage.auditTaskType', {
            type:
              auditTask?.data?.audit_plan_meta?.audit_plan_type_desc ?? '--',
          })}
        </Typography.Paragraph>
        {t('auditPlan.detailPage.pageDesc')}
      </PageHeader>

      <PlanDetail />
    </>
  );
};

export default PlanDetailPage;
