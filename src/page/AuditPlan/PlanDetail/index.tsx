import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import PlanDetail from './Detail';
import { PlanDetailUrlParams } from './index.type';

const PlanDetailPage = () => {
  const urlParams = useParams<PlanDetailUrlParams>();

  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        ghost={false}
        title={t('auditPlan.detailPage.pageTitle', {
          name: urlParams.auditPlanName,
        })}
        extra={[<BackButton key="goBack" />]}
      >
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
