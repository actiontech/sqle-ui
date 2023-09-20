import { Card, PageHeader, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import { useRequest } from 'ahooks';
import rule_template from '../../api/rule_template';
import RuleUnderstand from './RuleUnderstand';

const RuleKnowledge: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { ruleName = '' } = useParams<{ ruleName: string }>();

  const {
    data: ruleKnowledgeInfo,
    loading,
    refresh,
  } = useRequest(
    () =>
      rule_template.getRuleKnowledgeV1({ rule_name: ruleName }).then((res) => {
        return res.data;
      }),
    {
      ready: !!ruleName,
    }
  );

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
            <Typography.Title>
              {ruleKnowledgeInfo?.rule?.desc ?? '-'}
            </Typography.Title>
            <Typography.Text>
              {ruleKnowledgeInfo?.rule?.annotation ?? '-'}
            </Typography.Text>
          </Card>

          <RuleUnderstand
            ruleName={ruleName}
            content={ruleKnowledgeInfo?.knowledge_content}
            refresh={refresh}
          />
        </Space>
      </section>
    </>
  );
};
export default RuleKnowledge;
