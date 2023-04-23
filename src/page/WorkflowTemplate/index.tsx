import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

const WorkflowTemplate = () => {
  const { t } = useTranslation();
  return (
    <article>
      <PageHeader title={t('workflowTemplate.pageTitle')} ghost={false}>
        {t('workflowTemplate.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Outlet />
      </section>
    </article>
  );
};

export default WorkflowTemplate;
