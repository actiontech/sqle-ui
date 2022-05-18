import { useTheme } from '@material-ui/styles';
import { Card, PageHeader, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../types/theme.type';
import ExecuteResult from './ExecuteResult';
import { ISqlInputForm, SqlQueryResultType } from './index.type';
import SqlInput from './SqlInput';

const SqlQuery: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [form] = useForm<ISqlInputForm>();
  const [resultErrorMessage, setResultErrorMessage] = useState('');
  const [queryRes, setQueryRes] = useState<SqlQueryResultType[]>([]);

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
          {/* IFTRUE_isCE */}
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
          {/* FITRUE_isCE */}
          {/* IFTRUE_isEE */}
          <SqlInput
            setQueryRes={setQueryRes}
            setResultErrorMessage={setResultErrorMessage}
            form={form}
          />
          <ExecuteResult
            resultErrorMessage={resultErrorMessage}
            setResultErrorMessage={setResultErrorMessage}
            queryRes={queryRes}
            setQueryRes={setQueryRes}
            maxPreQueryRows={form.getFieldValue('maxPreQueryRows') ?? 100}
          />
          {/* FITRUE_isEE */}
        </Space>
      </section>
    </>
  );
};

export default SqlQuery;
