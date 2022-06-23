import { useBoolean } from 'ahooks';
import { Card, Empty } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DatabaseTablesProps } from '.';
import { ITable } from '../../../api/common';
import instance from '../../../api/instance';
import EmptyBox from '../../../components/EmptyBox';
import { CharCode, ResponseCode } from '../../../data/common';

import './DatabaseTables.less';

const DatabaseTables: React.FC<DatabaseTablesProps> = (props) => {
  const { dataSourceName, schemaName, getTableSchema } = props;

  const { t } = useTranslation();

  const [tables, setTables] = useState<ITable[][]>([]);

  const [
    loading,
    { setTrue: startGetDatabaseTables, setFalse: getDatabaseTablesFinish },
  ] = useBoolean();

  const getDatabaseTables = async () => {
    if (!dataSourceName || !schemaName) {
      return;
    }
    startGetDatabaseTables();
    try {
      const res = await instance.listTableBySchema({
        instance_name: dataSourceName,
        schema_name: schemaName,
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        const newTables = Array(26);
        const data = res.data.data ?? [];
        data.forEach((table) => {
          const name = table.name ?? '';
          let code = name.charCodeAt(0);
          if (code < CharCode.a) {
            code += CharCode.a - CharCode.A;
          }
          const index = code - CharCode.a;
          if (!newTables[index]) {
            newTables[index] = [];
          }
          newTables[index].push(table);
        });
        setTables(newTables);
      }
    } catch {
      setTables([]);
    } finally {
      getDatabaseTablesFinish();
    }
  };

  useEffect(() => {
    if (dataSourceName && schemaName) {
      getDatabaseTables();
    } else {
      setTables([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceName, schemaName]);

  const isEmpty = useMemo(() => {
    if (!dataSourceName || !schemaName) {
      return true;
    }
    const count = tables.reduce((s, c) => (s += c.length), 0);
    return count === 0;
  }, [dataSourceName, schemaName, tables]);

  const lock = useRef(false);
  const handleClickTableName = (tableName: string) => {
    if (lock.current) {
      return;
    }
    lock.current = true;
    getTableSchema(tableName).finally(() => {
      lock.current = false;
    });
  };

  return (
    <Card
      title={t('sqlQuery.databaseTables.title')}
      loading={loading}
      className="database-tables-wrapper"
    >
      <div className="database-tables-container">
        <EmptyBox if={!isEmpty} defaultNode={<Empty />}>
          {tables.map((v, index) => {
            if (!v || v.length === 0) {
              return null;
            }
            return (
              <React.Fragment key={index}>
                <div className="database-tables-title">
                  {String.fromCharCode(index + CharCode.A)}
                </div>
                {v.map((table) => (
                  <div className="database-tables-item" key={table.name}>
                    <span
                      onClick={() => handleClickTableName(table.name ?? '')}
                    >
                      {table.name}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </EmptyBox>
      </div>
    </Card>
  );
};

export default DatabaseTables;
