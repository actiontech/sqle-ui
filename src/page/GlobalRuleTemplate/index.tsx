import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

const GlobalRuleTemplate = () => {
  const { t } = useTranslation();

  return (
    <article className="rule-template-page-namespace">
      <PageHeader title={t('ruleTemplate.pageTitle')} ghost={false}>
        {t('ruleTemplate.pageDescribe')}
      </PageHeader>
      <section className="padding-content">
        <Outlet />
      </section>
    </article>
  );
};

export default GlobalRuleTemplate;
