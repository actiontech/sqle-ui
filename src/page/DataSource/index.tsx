import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

const DataSource = () => {
  const { t } = useTranslation();

  return (
    <article className="data-source-page-namespace">
      <PageHeader title={t('dataSource.pageTitle')} ghost={false}>
        {t('dataSource.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Outlet />
      </section>
    </article>
  );
};

export default DataSource;
