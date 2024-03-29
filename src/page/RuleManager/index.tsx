import { Card, PageHeader, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import GlobalRuleTemplate from '../GlobalRuleTemplate';
import CustomRule from '../CustomRule';
import useNavigate from '../../hooks/useNavigate';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { t } from '../../locale';
import { SQLE_BASE_URL } from '../../data/common';
import EnterpriseFeatureDisplay from '../../components/EnterpriseFeatureDisplay/EnterpriseFeatureDisplay';

const tabItems: TabsProps['items'] = [
  {
    label: t('ruleTemplate.globalRuleTemplateListTitle'),
    children: <GlobalRuleTemplate />,
    key: `${SQLE_BASE_URL}rule/template`,
  },
  {
    label: t('customRule.title'),
    children: (
      <EnterpriseFeatureDisplay
        clearCEWrapperPadding
        featureName={t('customRule.title')}
        eeFeatureDescription={t('customRule.ceTips')}
      >
        <CustomRule />
      </EnterpriseFeatureDisplay>
    ),
    key: `${SQLE_BASE_URL}rule/custom`,
  },
];

const RuleManager: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeKey, setActiveKey] = useState(tabItems[0].key);

  useEffect(() => {
    const currentKey = tabItems.find((v) =>
      location.pathname.startsWith(v.key)
    )?.key;
    if (currentKey) {
      setActiveKey(currentKey);
    }
  }, [location.pathname]);

  return (
    <article>
      <PageHeader title={t('ruleManager.pageTitle')} ghost={false}>
        {t('ruleManager.pageDesc')}
      </PageHeader>

      <section className="padding-content">
        <Card>
          <Tabs
            activeKey={activeKey}
            onChange={(key) => {
              navigate(key);
            }}
            items={tabItems}
          />
        </Card>
      </section>
    </article>
  );
};

export default RuleManager;
