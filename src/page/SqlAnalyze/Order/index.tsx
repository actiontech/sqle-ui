import { useBoolean } from 'ahooks';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ISQLExplain, ITableMeta } from '../../../api/common';
import task from '../../../api/task';
import { ResponseCode } from '../../../data/common';
import SqlAnalyze from '../SqlAnalyze';
import { OrderSqlAnalyzeUrlParams } from './index.type';

const OrderSqlAnalyze = () => {
  const urlParams = useParams<OrderSqlAnalyzeUrlParams>();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [sqlExplain, setSqlExplain] = useState<ISQLExplain>();
  const [tableSchemas, setTableSchemas] = useState<ITableMeta[]>([]);
  const [
    loading,
    { setTrue: startGetSqlAnalyze, setFalse: getSqlAnalyzeFinish },
  ] = useBoolean();

  const getSqlAnalyze = useCallback(async () => {
    startGetSqlAnalyze();
    try {
      const res = await task.getTaskAnalysisData({
        task_id: urlParams.taskId,
        number: Number.parseInt(urlParams.sqlNum, 10),
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        setErrorMessage('');
        setSqlExplain(res.data.data?.sql_explain);
        setTableSchemas(res.data.data?.table_metas ?? []);
      } else {
        setErrorMessage(res.data.message ?? '');
      }
    } finally {
      getSqlAnalyzeFinish();
    }
  }, [
    getSqlAnalyzeFinish,
    startGetSqlAnalyze,
    urlParams.sqlNum,
    urlParams.taskId,
  ]);

  useEffect(() => {
    getSqlAnalyze();
  }, [getSqlAnalyze]);

  return (
    <SqlAnalyze
      tableSchemas={tableSchemas}
      sqlExplain={sqlExplain}
      errorMessage={errorMessage}
      loading={loading}
    />
  );
};

export default OrderSqlAnalyze;
