import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import EnterpriseFeatureDisplay from '../../components/EnterpriseFeatureDisplay/EnterpriseFeatureDisplay';
import SQLPanel from './SQLPanel';

const SQLManagement: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t('sqlManagement.pageTitle')} ghost={false}>
        {t('sqlManagement.pageDesc')}
      </PageHeader>

      <SQLPanel />
      {/* <EnterpriseFeatureDisplay
        featureName={t('sqlManagement.pageTitle')}
        eeFeatureDescription={t('sqlManagement.eeFeatureDescription')}
      >
        <SQLPanel />
      </EnterpriseFeatureDisplay> */}
    </>
  );
};

export default SQLManagement;
