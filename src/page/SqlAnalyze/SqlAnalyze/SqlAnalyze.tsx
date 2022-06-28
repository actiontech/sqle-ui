import { Card, PageHeader, Result, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { SqlAnalyzeProps } from '.';
import EmptyBox from '../../../components/EmptyBox';
import useTableSchema from './useTableSchema';
import useSQLExecPlan from './useSQLExecPlan';

const SqlAnalyze: React.FC<SqlAnalyzeProps> = (props) => {
  const { t } = useTranslation();
  const {
    tableSchemas,
    sqlExplain,
    errorMessage,
    loading = false,
    errorType = 'error',
  } = props;

  const { generateTableSchemaContent } = useTableSchema();
  const { generateSQLExecPlanContent } = useSQLExecPlan();

  const createError = () => {
    if (errorType === 'error') {
      return (
        <Result
          status={errorType}
          title={t('common.request.noticeFailTitle')}
          subTitle={errorMessage}
        />
      );
    }
    return <Result status={errorType} title={errorMessage} />;
  };

  return (
    <>
      <PageHeader title={t('sqlAnalyze.pageTitle')} ghost={false}>
        {t('sqlAnalyze.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Card loading={loading}>
          <EmptyBox if={!errorMessage} defaultNode={createError()}>
            <Tabs>
              <Tabs.TabPane tab={t('sqlAnalyze.sqlExplain')}>
                {generateSQLExecPlanContent(sqlExplain ?? {})}
              </Tabs.TabPane>
              {tableSchemas.map((table) => {
                return (
                  <Tabs.TabPane
                    tab={t('sqlAnalyze.tableTitle', {
                      tableName: table.name,
                    })}
                    key={table.name}
                  >
                    {generateTableSchemaContent({
                      errorMessage: '',
                      tableMeta: table,
                    })}
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </EmptyBox>
        </Card>
      </section>
    </>
  );
};

export default SqlAnalyze;
