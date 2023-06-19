import { PageHeader, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import EnterpriseFeatureDisplay from '../../components/EnterpriseFeatureDisplay/EnterpriseFeatureDisplay';

const SyncDataSource: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <article>
        <PageHeader title={t('syncDataSource.pageTitle')} ghost={false}>
          {t('syncDataSource.pageDesc')}
        </PageHeader>

        <EnterpriseFeatureDisplay
          featureName={t('syncDataSource.pageTitle')}
          eeFeatureDescription={t('syncDataSource.ceTips')}
        >
          <section className="padding-content">
            <Outlet />
          </section>
        </EnterpriseFeatureDisplay>
      </article>
    </>
  );
};

export default SyncDataSource;
