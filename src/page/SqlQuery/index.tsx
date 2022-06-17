import { useTheme } from '@material-ui/styles';
import { Card, Col, PageHeader, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../api/instance';
import sql_query from '../../api/sql_query';
import {
  IGetSQLResultParams,
  IPrepareSQLQueryParams,
} from '../../api/sql_query/index.d';
import { ResponseCode } from '../../data/common';
import { Theme } from '../../types/theme.type';
import DatabaseTables from './DatabaseTables';
import ExecuteResult from './ExecuteResult';
import useTableSchema from './ExecuteResult/useTableSchema';
import { ISqlInputForm, SqlQueryResultType } from './index.type';
import SqlInput from './SqlInput';
import useSQLExecPlan from './useSQLExecPlan';

export const DefaultMaxQueryRows = 100;

const SqlQuery: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [form] = useForm<ISqlInputForm>();

  const [queryRes, setQueryRes] = useState<SqlQueryResultType[]>([]);

  const [dataSourceName, setDataSourceName] = useState('');
  const [schemaName, setSchemaName] = useState('');

  const [maxQueryRows, setMaxQueryRows] = useState(DefaultMaxQueryRows);

  const getSqlQueryResultList = async (values: ISqlInputForm) => {
    const prepareSqlQueryParams: IPrepareSQLQueryParams = {
      instance_name: values.instanceName,
      instance_schema: values.instanceSchema,
      sql: values.sql,
    };
    const prepareSqlQueryRes = await sql_query.prepareSQLQuery(
      prepareSqlQueryParams
    );
    if (prepareSqlQueryRes.data.code !== ResponseCode.SUCCESS) {
      return;
    }
    const actionArray = prepareSqlQueryRes.data.data?.query_ids?.map(
      ({ query_id }) => {
        const getSqlResultParams: IGetSQLResultParams = {
          query_id: query_id ?? '',
          page_size: values.maxPreQueryRows,
          page_index: 1,
        };
        return sql_query.getSQLResult(getSqlResultParams);
      }
    );
    const sqlQueryResultList = await Promise.all(actionArray ?? []);
    const realQueryRes: SqlQueryResultType[] =
      prepareSqlQueryRes.data.data?.query_ids?.map((v, index) => {
        const item: SqlQueryResultType = {
          sqlQueryId: v.query_id ?? '',
          resultItem: sqlQueryResultList[index].data.data ?? {},
          hide: false,
          errorMessage: '',
        };
        if (sqlQueryResultList[index].data.code !== ResponseCode.SUCCESS) {
          item.errorMessage = sqlQueryResultList[index].data.message ?? '';
        }
        return item;
      }) ?? [];
    setQueryRes(realQueryRes);
  };

  const updateQueryRes = (item: SqlQueryResultType) => {
    const newQueryRes = cloneDeep(queryRes);
    const oldItem = newQueryRes.findIndex(
      (v) => v.sqlQueryId === item.sqlQueryId
    );
    if (oldItem === -1) {
      return;
    }
    newQueryRes[oldItem] = item;
    setQueryRes(newQueryRes);
  };

  useEffect(() => {
    if (dataSourceName) {
      instance.getInstanceV1({ instance_name: dataSourceName }).then((res) => {
        if (res) {
          const rowsLength =
            res.data.data?.sql_query_config?.max_pre_query_rows ??
            DefaultMaxQueryRows;
          form.setFieldsValue({
            maxPreQueryRows:
              rowsLength > DefaultMaxQueryRows
                ? DefaultMaxQueryRows
                : rowsLength,
          });
          setMaxQueryRows(rowsLength);
        }
      });
    }
  }, [form, dataSourceName]);

  const { tableSchemas, closeTableSchema, getTableSchemas } = useTableSchema({
    dataSourceName,
    schemaName,
  });

  const { getSQLExecPlan, execPlans, closeExecPlan } = useSQLExecPlan({ form });

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
          <Row gutter={theme.common.padding}>
            <Col span={18}>
              <SqlInput
                form={form}
                dataSourceName={dataSourceName}
                maxQueryRows={maxQueryRows}
                updateDataSourceName={setDataSourceName}
                updateSchemaName={setSchemaName}
                submitForm={getSqlQueryResultList}
                getSQLExecPlan={getSQLExecPlan}
              />
            </Col>
            <Col span={6}>
              <DatabaseTables
                dataSourceName={dataSourceName}
                schemaName={schemaName}
                getTableSchema={getTableSchemas}
              />
            </Col>
          </Row>
          <ExecuteResult
            queryRes={queryRes}
            updateQueryResult={updateQueryRes}
            maxPreQueryRows={maxQueryRows}
            tableSchemas={tableSchemas}
            closeTableSchema={closeTableSchema}
            sqlExecPlan={execPlans}
            closeExecPlan={closeExecPlan}
          />
          {/* FITRUE_isEE */}
        </Space>
      </section>
    </>
  );
};

export default SqlQuery;
