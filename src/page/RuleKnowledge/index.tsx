import { Card, PageHeader, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import { useRequest } from 'ahooks';
import rule_template from '../../api/rule_template';
import RuleUnderstand from './RuleUnderstand';
import { useEffect, useState } from 'react';
import EmptyBox from '../../components/EmptyBox';
import useCurrentUser from '../../hooks/useCurrentUser';

const RuleKnowledge: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const { ruleName = '' } = useParams<{ ruleName: string }>();
  const [dbType, setDbType] = useState<string>();
  const { isAdmin } = useCurrentUser();

  const {
    data: ruleKnowledgeInfo,
    loading,
    refresh,
  } = useRequest(
    () =>
      rule_template
        .getRuleKnowledgeV1({ rule_name: ruleName, db_type: dbType! })
        .then((res) => {
          return res.data.data;
        }),
    {
      ready: !!ruleName && !!dbType,
      refreshDeps: [ruleName, dbType],
    }
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const dbTypeInUrl = searchParams.get('db_type');

    if (dbTypeInUrl) {
      setDbType(dbTypeInUrl);
    }
  }, [location.search]);

  return (
    <>
      <PageHeader title={t('ruleKnowledge.pageTitle')} ghost={false}>
        {t('ruleKnowledge.pageDesc')}
      </PageHeader>

      <section className="padding-content">
        <Space
          direction="vertical"
          size={theme.common.padding}
          className="full-width-element"
        >
          <Card loading={loading}>
            <Typography.Title level={4}>
              {ruleKnowledgeInfo?.rule?.desc ?? '-'}
            </Typography.Title>
            <Typography.Text>
              {ruleKnowledgeInfo?.rule?.annotation ?? '-'}
            </Typography.Text>
          </Card>

          <EmptyBox if={!!dbType}>
            <RuleUnderstand
              loading={loading}
              ruleName={ruleName}
              content={ruleKnowledgeInfo?.knowledge_content}
              refresh={refresh}
              dbType={dbType!}
              isAdmin={isAdmin}
            />
          </EmptyBox>
        </Space>
      </section>
    </>
  );
};
export default RuleKnowledge;
