import { Card, Space, Table } from 'antd';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import sql_query from '../../../api/sql_query';
import { ResponseCode } from '../../../data/common';
import useBackendTable from '../../../hooks/useBackendTable';
import HighlightCode from '../../../utils/HighlightCode';
import {
  SQLExecPlanItem,
  UseSQLExecPlanOption,
} from '../../SqlQuery/index.type';

const useSQLExecPlan = (options?: UseSQLExecPlanOption) => {
  const { form } = options ?? {};

  const { t } = useTranslation();

  const [execPlans, setExecPlans] = useState<SQLExecPlanItem[]>([]);

  const idFactory = (
    sql: string,
    dataSourceName: string,
    schemaName: string
  ) => {
    return `${sql}_${dataSourceName}_${schemaName}`;
  };

  const closeExecPlan = (id: string) => {
    const newExecPlans = cloneDeep(execPlans);
    const index = newExecPlans.findIndex((v) => v.id === id);
    if (index === -1) {
      return;
    }
    newExecPlans[index].hide = true;
    setExecPlans(newExecPlans);
  };

  const getSQLExecPlan = async () => {
    if (!form) {
      return;
    }
    const values = await form.validateFields([
      'sql',
      'instanceName',
      'instanceSchema',
    ]);
    const { sql, instanceName, instanceSchema } = values;
    const result = await sql_query.getSQLExplain({
      sql,
      instance_name: instanceName,
      instance_schema: instanceSchema,
    });
    if (result.data.code === ResponseCode.SUCCESS) {
      const data = result.data.data ?? [];
      setExecPlans(
        data.map((e, i) => ({
          ...e,
          id: idFactory(`${e.sql}-${i}`, instanceName, instanceSchema),
          hide: false,
        }))
      );
    } else {
      setExecPlans([]);
    }
  };

  const { tableColumnFactory } = useBackendTable();

  const generateSQLExecPlanContent = <
    T extends Pick<SQLExecPlanItem, 'sql' | 'classic_result'>
  >(
    item: T
  ) => {
    const { sql, classic_result: explain } = item;

    const renderSQL = () => {
      return (
        <Card title={t('sqlQuery.executePlan.sql')}>
          <pre
            dangerouslySetInnerHTML={{
              __html: HighlightCode.highlightSql(sql ?? ''),
            }}
          />
        </Card>
      );
    };

    const renderSQLExplain = () => {
      return (
        <Card title={t('sqlQuery.executePlan.sqlExplain')}>
          <Table
            columns={tableColumnFactory(explain?.head ?? [])}
            dataSource={explain?.rows ?? []}
            pagination={false}
          />
        </Card>
      );
    };

    return (
      <Space direction="vertical" className="full-width-element">
        {renderSQL()}
        {renderSQLExplain()}
      </Space>
    );
  };

  return {
    execPlans,
    getSQLExecPlan,
    closeExecPlan,
    generateSQLExecPlanContent,
  };
};

export default useSQLExecPlan;
