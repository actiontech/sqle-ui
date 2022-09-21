import { WarningOutlined } from '@ant-design/icons';
import { useTheme } from '@material-ui/styles';
import { useRequest } from 'ahooks';
import { Card, Result, Space } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import configuration from '../../api/configuration';
import EmptyBox from '../../components/EmptyBox';
import { Theme } from '../../types/theme.type';

const SqlQueryEE = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

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
        window.open(res.sql_query_root_uri);
      }
    });
  }, [getSqlQueryUrl]);

  return (
    <section className="padding-content">
      <Space
        size={theme.common.padding}
        direction="vertical"
        className="full-width-element"
      >
        <Card loading={loading}>
          <EmptyBox
            if={!!data && Reflect.has(data, 'enable_sql_query')}
            defaultNode={
              <Result
                status="500"
                title={t('common.request.noticeFailTitle')}
              />
            }
          >
            <Space>
              <WarningOutlined
                className="text-orange"
                style={{ fontSize: 50 }}
              />
              {t('sqlQuery.eeErrorTips')}
            </Space>
          </EmptyBox>
        </Card>
      </Space>
    </section>
  );
};

export default SqlQueryEE;
