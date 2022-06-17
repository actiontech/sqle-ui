import { Card, Empty, Result, Table, Tabs } from 'antd';
import { cloneDeep } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IGetSQLResultResDataV1 } from '../../../api/common';
import sql_query from '../../../api/sql_query';
import { IGetSQLResultParams } from '../../../api/sql_query/index.d';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import useBackendTable from '../../../hooks/useBackendTable';
import useSQLExecPlan from '../useSQLExecPlan';
import { ExecuteResultProps } from './index.type';
import useTableSchema from './useTableSchema';

const ExecuteResult: React.FC<ExecuteResultProps> = ({
  queryRes,
  updateQueryResult,
  maxPreQueryRows,
  tableSchemas,
  closeTableSchema,
  sqlExecPlan,
  closeExecPlan,
}) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('');
  const [resultTotal, setResultTotal] = useState(0);

  // table schema
  const { generateTableSchemaContent } = useTableSchema();

  const { generateSQLExecPlanContent } = useSQLExecPlan();

  const getFirstActiveKey = () => {
    if (queryRes.length > 0) {
      const shouldShowItem = queryRes.find((e) => !e.hide);
      if (shouldShowItem) {
        return shouldShowItem.sqlQueryId;
      }
    }
    if (tableSchemas.length > 0) {
      return tableSchemas[0].id;
    }
    if (sqlExecPlan.length > 0) {
      const shouldShowItem = sqlExecPlan.find((e) => !e.hide);
      if (shouldShowItem) {
        return shouldShowItem.id;
      }
    }
    return '';
  };

  useEffect(() => {
    const currentQueryTab = queryRes.find((v) => v.sqlQueryId === activeKey);
    const currentSchemaTab = tableSchemas.find((v) => v.id === activeKey);
    const currentExecPlan = sqlExecPlan.find((v) => v.id === activeKey);
    if (!currentQueryTab && !currentSchemaTab && !currentExecPlan) {
      setActiveKey(getFirstActiveKey());
      setResultTotal(0);
      return;
    }
    if (currentQueryTab?.hide || currentExecPlan?.hide) {
      setActiveKey(getFirstActiveKey());
      setResultTotal(0);
      return;
    }
    if (currentQueryTab && !currentQueryTab.hide) {
      setResultTotal((v) => {
        const currentPageLength = currentQueryTab.resultItem.rows?.length ?? 0;
        const currentPage = currentQueryTab.resultItem.current_page ?? 1;
        if (currentPageLength === 0) {
          return v;
        }
        if (currentPageLength === maxPreQueryRows) {
          return currentPage * currentPageLength + 1;
        }
        return v + currentPageLength + 1;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, maxPreQueryRows, queryRes, tableSchemas, sqlExecPlan]);

  const { tableColumnFactory } = useBackendTable();
  const generateResultTab = useMemo(() => {
    const tabsOnChange = (key: string) => {
      setActiveKey(key);
    };
    const pageChange = (page: number, queryId: string) => {
      getSqlQueryResultItem(page, queryId);
    };

    const getSqlQueryResultItem = async (
      pageIndex: number,
      queryId: string
    ) => {
      const getSqlResultParams: IGetSQLResultParams = {
        query_id: queryId,
        page_size: maxPreQueryRows,
        page_index: pageIndex,
      };
      const sqlQueryResult = await sql_query.getSQLResult(getSqlResultParams);
      const item = queryRes.find((v) => v.sqlQueryId === queryId);
      if (!item) {
        return;
      }
      const newItem = cloneDeep(item);
      if (sqlQueryResult.data.code !== ResponseCode.SUCCESS) {
        newItem.errorMessage =
          sqlQueryResult.data.message ?? t('common.unknownError');
        newItem.resultItem = {};
      } else {
        newItem.resultItem = sqlQueryResult.data.data ?? {};
        newItem.errorMessage = '';
      }
      updateQueryResult(newItem);
    };

    const tabsOnEdit = (
      targetKey: React.MouseEvent | React.KeyboardEvent | string,
      action: 'add' | 'remove'
    ) => {
      if (action === 'remove') {
        const item = queryRes.find((e) => e.sqlQueryId === targetKey);
        if (item) {
          const newItem = cloneDeep(item);
          newItem.hide = true;
          updateQueryResult(newItem);
        }
        const tableSchemaItem = tableSchemas.find((e) => e.id === targetKey);
        if (tableSchemaItem) {
          closeTableSchema(tableSchemaItem.id);
        }
        const execPlanItem = sqlExecPlan.find((e) => e.id === targetKey);
        if (execPlanItem) {
          closeExecPlan(execPlanItem.id);
        }
      }
    };

    const generateTabsContent = (
      resultItem: IGetSQLResultResDataV1,
      queryId: string,
      errorMessage: string
    ) => {
      return (
        <Table
          style={{ overflowX: 'auto' }}
          dataSource={resultItem.rows ?? []}
          columns={tableColumnFactory(resultItem.head ?? [])}
          locale={{
            emptyText: errorMessage ? (
              <Result
                status="error"
                title={t('common.request.noticeFailTitle')}
                subTitle={errorMessage}
              />
            ) : undefined,
          }}
          pagination={{
            total: resultTotal,
            current: resultItem.current_page,
            pageSize: maxPreQueryRows,
            showSizeChanger: false,
            onChange: (page) => pageChange(page, queryId),
            showQuickJumper: true,
            showTotal: () => {
              return (
                <>
                  {t('sqlQuery.executeResult.paginationInfo', {
                    current_page: resultItem.current_page,
                    start_line: resultItem.start_line,
                    end_line: resultItem.end_line,
                    execution_time: resultItem.execution_time,
                  })}
                </>
              );
            },
          }}
        />
      );
    };

    return (
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={activeKey}
        onChange={tabsOnChange}
        onEdit={tabsOnEdit}
      >
        {queryRes.map((v, index) => {
          if (v.hide) {
            return null;
          }
          return (
            <Tabs.TabPane
              tab={t('sqlQuery.executeResult.resultTitle', {
                index: index + 1,
              })}
              key={v.sqlQueryId}
            >
              {generateTabsContent(v.resultItem, v.sqlQueryId, v.errorMessage)}
            </Tabs.TabPane>
          );
        })}
        {tableSchemas.map((v) => {
          return (
            <Tabs.TabPane
              tab={t('sqlQuery.databaseTables.tabTitle', {
                tableName: v.tableMeta.name,
              })}
              key={v.id}
            >
              {generateTableSchemaContent(v)}
            </Tabs.TabPane>
          );
        })}
        {sqlExecPlan.map((v, index) => {
          if (v.hide) {
            return null;
          }
          return (
            <Tabs.TabPane
              tab={t('sqlQuery.executePlan.title', {
                index: index + 1,
              })}
              key={v.id}
            >
              {generateSQLExecPlanContent(v)}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  }, [
    activeKey,
    closeExecPlan,
    closeTableSchema,
    generateSQLExecPlanContent,
    generateTableSchemaContent,
    maxPreQueryRows,
    queryRes,
    resultTotal,
    sqlExecPlan,
    t,
    tableColumnFactory,
    tableSchemas,
    updateQueryResult,
  ]);

  const isEmpty = useMemo(() => {
    const noQuery = queryRes.length === 0 || queryRes.every((e) => e.hide);
    const noTable = tableSchemas.length === 0;
    const noExecPlan =
      sqlExecPlan.length === 0 || sqlExecPlan.every((e) => e.hide);
    return noQuery && noTable && noExecPlan;
  }, [queryRes, tableSchemas, sqlExecPlan]);

  return (
    <Card title={t('sqlQuery.executeResult.title')}>
      <EmptyBox if={!isEmpty} defaultNode={<Empty />}>
        {generateResultTab}
      </EmptyBox>
    </Card>
  );
};

export default ExecuteResult;
