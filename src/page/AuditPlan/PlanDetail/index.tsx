import { useRequest } from 'ahooks';
import { PageHeader, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import audit_plan from '../../../api/audit_plan';
import BackButton from '../../../components/BackButton';
import PlanDetail from './Detail';
import { PlanDetailUrlParams } from './index.type';

const PlanDetailPage = () => {
  const urlParams = useParams<PlanDetailUrlParams>();

  const { t } = useTranslation();

  const { data: auditTask } = useRequest(
    () => {
      return audit_plan.getAuditPlanV1({
        audit_plan_name: urlParams.auditPlanName,
      });
    },
    {
      formatResult(res) {
        return res.data;
      },
    }
  );

  return (
    <>
      <PageHeader
        ghost={false}
        title={t('auditPlan.detailPage.pageTitle', {
          name: urlParams.auditPlanName,
        })}
        extra={[<BackButton key="goBack" />]}
      >
        <Typography.Paragraph>
          {t('auditPlan.detailPage.auditTaskType', {
            type:
              auditTask?.data?.audit_plan_meta?.audit_plan_type_desc ?? '--',
          })}
        </Typography.Paragraph>
        {t('auditPlan.detailPage.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Switch>
          <Route
            path="/auditPlan/detail/:auditPlanName"
            component={PlanDetail}
          />
          <Redirect to="/auditPlan" />
        </Switch>
      </section>
    </>
  );
};

export default PlanDetailPage;
