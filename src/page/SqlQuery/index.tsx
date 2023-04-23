import { WarningOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/styles';
import { useRequest } from 'ahooks';
import { Card, PageHeader, Space, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import configuration from '../../api/configuration';
import EmptyBox from '../../components/EmptyBox';
import { OPEN_CLOUD_BEAVER_URL_PARAM_NAME } from '../../data/common';
import { Theme } from '@mui/material/styles';

const SqlQueryEE = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const location = useLocation();
  const cloudbeaverUrl = useRef('');

  const {
    data,
    loading,
    runAsync: getSqlQueryUrl,
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
      }

      const params = new URLSearchParams(location.search);

      if (params.get(OPEN_CLOUD_BEAVER_URL_PARAM_NAME) === 'true') {
        window.open(cloudbeaverUrl.current);
      }
    });
  }, [getSqlQueryUrl, location.search]);

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
                  <a
                    target="_blank"
                    href="https://actiontech.github.io/sqle-docs-cn/3.modules/4.2_sql_editor/overview.html"
                    rel="noreferrer"
                  >
                    {t('common.clickHere')}
                  </a>
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
