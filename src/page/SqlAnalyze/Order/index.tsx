import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/lib/result';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMetas,
} from '../../../api/common';
import task from '../../../api/task';
import { ResponseCode } from '../../../data/common';
import SqlAnalyze from '../SqlAnalyze';
import { OrderSqlAnalyzeUrlParams } from './index.type';

const OrderSqlAnalyze = () => {
  const urlParams = useParams<OrderSqlAnalyzeUrlParams>();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [sqlExplain, setSqlExplain] = useState<ISQLExplain>();
  const [tableMetas, setTableMetas] = useState<ITableMetas>();
  const [performanceStatistics, setPerformancesStatistics] =
    useState<IPerformanceStatistics>();
  const [
    loading,
    { setTrue: startGetSqlAnalyze, setFalse: getSqlAnalyzeFinish },
  ] = useBoolean();
  const [errorType, setErrorType] = useState<ResultStatusType>('error');

  const getSqlAnalyze = useCallback(async () => {
    startGetSqlAnalyze();
    try {
      const res = await task.getTaskAnalysisDataV2({
        task_id: urlParams.taskId,
        number: Number.parseInt(urlParams.sqlNum, 10),
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        setErrorMessage('');
        setSqlExplain(res.data.data?.sql_explain);
        setTableMetas(res.data.data?.table_metas);
        setPerformancesStatistics(res.data.data?.performance_statistics);
      } else {
        if (res.data.code === ResponseCode.NotSupportDML) {
          setErrorType('info');
        } else {
          setErrorType('error');
        }
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
      errorType={errorType}
      tableMetas={tableMetas}
      sqlExplain={sqlExplain}
      errorMessage={errorMessage}
      performanceStatistics={performanceStatistics}
      loading={loading}
    />
  );
};

export default OrderSqlAnalyze;
