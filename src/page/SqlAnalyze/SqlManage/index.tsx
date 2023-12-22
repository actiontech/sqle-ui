import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/lib/result';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMetas,
} from '../../../api/common';
import { ResponseCode } from '../../../data/common';
import SqlAnalyze from '../SqlAnalyze';
import { SQLManageAnalyzeUrlParams } from './index.type';
import SqlManage from '../../../api/SqlManage';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';

const SQLManageAnalyze = () => {
  const urlParams = useParams<SQLManageAnalyzeUrlParams>();
  const { projectName } = useCurrentProjectName();
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
      const res = await SqlManage.GetSqlManageSqlAnalysisV1({
        sql_manage_id: urlParams.sqlManageId ?? '',
        project_name: projectName,
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
    projectName,
    startGetSqlAnalyze,
    urlParams.sqlManageId,
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

export default SQLManageAnalyze;
