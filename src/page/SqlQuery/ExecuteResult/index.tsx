import { Card, Empty, Result, Table, Tabs, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IGetSQLResultResDataV1 } from '../../../api/common';
import sql_query from '../../../api/sql_query';
import { IGetSQLResultParams } from '../../../api/sql_query/index.d';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import { TableColumn } from '../../../types/common.type';
import { ExecuteResultProps } from './index.type';

const ExecuteResult: React.FC<ExecuteResultProps> = ({
  resultErrorMessage,
  queryRes,
  setQueryRes,
  maxPreQueryRows,
  setResultErrorMessage,
}) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('');
  const [resultTotal, setResultTotal] = useState(0);

  useEffect(() => {
    const currentTab = queryRes.find((v) => v.sqlQueryId === activeKey);
    if (!currentTab) {
      setActiveKey(queryRes[0]?.sqlQueryId);
      return;
    }
    setResultTotal((total) => {
      const calcTotal =
        total +
        (currentTab.resultItem.rows?.length ?? 0) *
          (currentTab.resultItem.current_page ?? 1);
      return calcTotal < maxPreQueryRows ? calcTotal : calcTotal + 1;
    });
  }, [activeKey, maxPreQueryRows, queryRes]);

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
      if (sqlQueryResult.data.code !== ResponseCode.SUCCESS) {
        setResultErrorMessage(
          sqlQueryResult.data.message ?? t('common.unknownError')
        );
        return;
      }
      setResultErrorMessage('');
      setQueryRes((v) => {
        const realQueryRes = [...v];
        realQueryRes.forEach((item) => {
          if (item.sqlQueryId === queryId) {
            item.resultItem = sqlQueryResult.data.data ?? {};
          }
        });
        return realQueryRes;
      });
    };

    const tabsOnEdit = (
      targetKey: React.MouseEvent | React.KeyboardEvent | string,
      action: 'add' | 'remove'
    ) => {
      if (action === 'remove') {
        const realQueryRes = [...queryRes];
        realQueryRes.forEach((v) => {
          if (v.sqlQueryId === targetKey) {
            v.hide = true;
          }
        });
        setQueryRes(realQueryRes);
      }
    };

    const generateTabsContent = (
      resultItem: IGetSQLResultResDataV1,
      queryId: string
    ) => {
      const column: TableColumn<{ [key in string]: string }> =
        resultItem.head?.map((v) => {
          return {
            dataIndex: v.field_name ?? '',
            title: v.field_name ?? '',
            render: (text) => {
              return text ? (
                <div style={{ minWidth: 40 }}>
                  <Typography.Paragraph copyable={{ text }}>
                    <Tooltip title={text}>
                      <Typography.Text
                        style={{ maxWidth: 300 }}
                        ellipsis={true}
                      >
                        {text}
                      </Typography.Text>
                    </Tooltip>
                  </Typography.Paragraph>
                </div>
              ) : (
                '-'
              );
            },
          };
        }) ?? [];

      return (
        <Table
          style={{ overflowX: 'auto' }}
          dataSource={resultItem.rows}
          columns={column}
          pagination={{
            total: resultTotal,
            current: resultItem.current_page,
            pageSize: maxPreQueryRows,
            showSizeChanger: false,
            onChange: (page) => pageChange(page, queryId),
            showQuickJumper: true,
            showTotal: (total) => {
              return (
                <>
                  {total}:
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
              {generateTabsContent(v.resultItem, v.sqlQueryId)}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  }, [
    activeKey,
    maxPreQueryRows,
    queryRes,
    resultTotal,
    setQueryRes,
    setResultErrorMessage,
    t,
  ]);
  return (
    <Card title={t('sqlQuery.executeResult.title')}>
      <EmptyBox
        if={queryRes.filter((v) => !v.hide).length > 0}
        defaultNode={<Empty />}
      >
        {resultErrorMessage ? (
          <Result
            status="error"
            title={t('sqlQuery.executeResult.errorMessageTitle')}
            subTitle={resultErrorMessage}
          />
        ) : (
          generateResultTab
        )}
      </EmptyBox>
    </Card>
  );
};

export default ExecuteResult;
