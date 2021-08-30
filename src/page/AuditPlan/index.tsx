import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import CreateAuditPlan from './CreatePlan';
import PlanList from './PlanList';
import UpdateAuditPlan from './UpdatePlan';

const AuditPlan = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader ghost={false} title={t('auditPlan.pageTitle')}>
        {t('auditPlan.pageDesc')}
      </PageHeader>

      <section className="padding-content">
        <Switch>
          <Route path="/auditPlan" exact={true} component={PlanList} />
          <Route path="/auditPlan/create" component={CreateAuditPlan} />
          <Route
            path="/auditPlan/update/:auditPlanName"
            component={UpdateAuditPlan}
          />
          <Redirect to="/auditPlan" />
        </Switch>
      </section>
    </>
  );
};

export default AuditPlan;
