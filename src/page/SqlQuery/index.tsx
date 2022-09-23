import { WarningOutlined } from '@ant-design/icons';
import { useTheme } from '@material-ui/styles';
import { useRequest } from 'ahooks';
import { Card, PageHeader, Space, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import configuration from '../../api/configuration';
import EmptyBox from '../../components/EmptyBox';
import { Theme } from '../../types/theme.type';

const SqlQueryEE = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

  const cloudbeaverUrl = useRef('');

  const {
    data,
    loading,
    run: getSqlQueryUrl,
  } = useRequest(
    () => {
      return configuration.getSQLQueryConfiguration().then((res) => {
        return res.data.data;
      });
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    getSqlQueryUrl().then((res) => {
      if (res?.enable_sql_query) {
        cloudbeaverUrl.current = res.sql_query_root_uri as string;
        window.open(res.sql_query_root_uri);
      }
    });
  }, [getSqlQueryUrl]);

  const openCloudbeaver = () => {
    window.open(cloudbeaverUrl.current);
  };

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
          <Card loading={loading}>
            <EmptyBox
              if={!data?.enable_sql_query}
              defaultNode={
                <Typography.Link onClick={openCloudbeaver}>
                  {t('sqlQuery.jumpToCloudbeaver')}
                </Typography.Link>
              }
            >
              <Space>
                <WarningOutlined
                  className="text-orange"
                  style={{ fontSize: 50 }}
                />
                <div>
                  {t('sqlQuery.eeErrorTips')}。{t('sqlQuery.eeErrorTips2')}
                  <Link
                    target="_blank"
                    to="https://actiontech.github.io/sqle-docs-cn/3.modules/4.2_sql_editor/overview.html"
                  >
                    {t('common.clickHere')}
                  </Link>
                </div>
              </Space>
            </EmptyBox>
          </Card>
        </Space>
      </section>
    </>
  );
};

export default SqlQueryEE;
