import { Card, Result, Space, Table } from 'antd';
import { cloneDeep } from 'lodash';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import instance from '../../../api/instance';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import useBackendTable from '../../../hooks/useBackendTable';
import HighlightCode from '../../../utils/HighlightCode';
import {
  TableSchemaItem,
  UseTableSchemaOption,
} from '../../SqlQuery/ExecuteResult/index.type';

const useTableSchema = (options?: UseTableSchemaOption) => {
  const { t } = useTranslation();
  const { schemaName, dataSourceName } = options ?? {};

  const idFactory = useCallback(
    (tableName: string) => {
      return `${tableName}-${schemaName}-${dataSourceName}`;
    },
    [dataSourceName, schemaName]
  );

  const [tableSchemas, setTableSchemas] = useState<TableSchemaItem[]>([]);

  const getTableSchemas = useCallback(
    async (tableName: string) => {
      if (!schemaName || !dataSourceName) {
        setTableSchemas([]);
        return;
      }
      const oldItemIndex = tableSchemas.findIndex(
        (v) => v.id === idFactory(tableName)
      );
      let newTableSchemas = cloneDeep(tableSchemas);
      const res = await instance.getTableMetadata({
        instance_name: dataSourceName,
        schema_name: schemaName,
        table_name: tableName,
      });
      if (oldItemIndex !== -1) {
        newTableSchemas.splice(oldItemIndex, 1);
      }
      const item = {
        id: idFactory(tableName),
        tableMeta: res.data.data ?? {},
        errorMessage: '',
      };
      if (res.data.code !== ResponseCode.SUCCESS) {
        item.errorMessage = res.data.message ?? '';
      }
      newTableSchemas.push(item);
      setTableSchemas(newTableSchemas);
    },
    [dataSourceName, idFactory, schemaName, tableSchemas]
  );

  const closeTableSchema = (id: string) => {
    setTableSchemas(tableSchemas.filter((v) => v.id !== id));
  };

  const { tableColumnFactory } = useBackendTable();

  const generateTableSchemaContent = <
    T extends Pick<TableSchemaItem, 'errorMessage' | 'tableMeta'>
  >(
    item: T
  ) => {
    const renderTableColumnTable = () => {
      return (
        <Card title={t('sqlQuery.databaseTables.columns')}>
          <Table
            columns={tableColumnFactory(item.tableMeta.columns?.head ?? [])}
            dataSource={item.tableMeta.columns?.rows}
            pagination={false}
          />
        </Card>
      );
    };

    const renderTableIndexTable = () => {
      return (
        <Card title={t('sqlQuery.databaseTables.index')}>
          <Table
            columns={tableColumnFactory(item.tableMeta.indexes?.head ?? [])}
            dataSource={item.tableMeta.indexes?.rows}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      );
    };

    const renderCreateTableSql = () => {
      return (
        <Card title={t('sqlQuery.databaseTables.createdTableSql')}>
          <pre
            dangerouslySetInnerHTML={{
              __html: HighlightCode.highlightSql(
                item.tableMeta.create_table_sql ?? ''
              ),
            }}
          />
        </Card>
      );
    };
    const renderErrorMessage = () => {
      if (!!item.tableMeta.message) {
        return <Result status="error" title={item.tableMeta.message} />;
      }
      if (!!item.errorMessage) {
        return (
          <Result
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={item.errorMessage}
          />
        );
      }
      return undefined;
    };

    const hasError = !!item.errorMessage || !!item.tableMeta.message;

    return (
      <EmptyBox if={!hasError} defaultNode={renderErrorMessage()}>
        <Space direction="vertical" className="full-width-element">
          {renderTableColumnTable()}
          {renderTableIndexTable()}
          {renderCreateTableSql()}
        </Space>
      </EmptyBox>
    );
  };

  return {
    tableSchemas,
    closeTableSchema,
    getTableSchemas,
    generateTableSchemaContent,
  };
};

export default useTableSchema;
