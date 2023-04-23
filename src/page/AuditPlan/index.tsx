import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

const AuditPlan = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader ghost={false} title={t('auditPlan.pageTitle')}>
        {t('auditPlan.pageDesc')}
      </PageHeader>

      <section className="padding-content">
        <Outlet />
      </section>
    </>
  );
};

export default AuditPlan;
