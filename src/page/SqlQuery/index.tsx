import { useTheme } from '@material-ui/styles';
import { Card, PageHeader, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../types/theme.type';

export const DefaultMaxQueryRows = 100;

const SqlQuery: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  return (
    <>
      <PageHeader title={t('sqlQuery.pageTitle')} ghost={false}>
        {t('sqlQuery.pageDescribe')}
      </PageHeader>

      <section className="padding-content">
        <Space
          size={theme.common.padding}
          direction="vertical"
          className="full-width-element"
        >
          <Card>
            {t('sqlQuery.ceTips')}
            <Typography.Paragraph>
              <ul>
                <li>
                  <a href="https://actiontech.github.io/sqle-docs-cn/">
                    https://actiontech.github.io/sqle-docs-cn/
                  </a>
                </li>
                <li>
                  <a href="https://www.actionsky.com/">
                    https://www.actionsky.com/
                  </a>
                </li>
              </ul>
            </Typography.Paragraph>
          </Card>
        </Space>
      </section>
    </>
  );
};

export default SqlQuery;
