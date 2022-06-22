import { Card, PageHeader, Result, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { SqlAnalyzeProps } from '.';
import EmptyBox from '../../../components/EmptyBox';
import useTableSchema from './useTableSchema';
import useSQLExecPlan from './useSQLExecPlan';

const SqlAnalyze: React.FC<SqlAnalyzeProps> = (props) => {
  const { t } = useTranslation();
  const { tableSchemas, sqlExplain, errorMessage, loading = false } = props;

  const { generateTableSchemaContent } = useTableSchema();
  const { generateSQLExecPlanContent } = useSQLExecPlan();

  return (
    <>
      <PageHeader title={t('sqlAnalyze.pageTitle')} ghost={false}>
        {t('sqlAnalyze.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Card loading={loading}>
          <EmptyBox
            if={!errorMessage}
            defaultNode={
              <Result
                status="error"
                title={t('common.request.noticeFailTitle')}
                subTitle={errorMessage}
              />
            }
          >
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
