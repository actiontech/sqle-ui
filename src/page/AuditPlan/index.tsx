import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import CreateAuditPlan from './CreatePlan';
import PlanList from './PlanList';

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
          <Redirect to="/auditPlan" />
        </Switch>
      </section>
    </>
  );
};

export default AuditPlan;
