import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/lib/result';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import audit_plan from '../../../api/audit_plan';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMetas,
} from '../../../api/common';
import { ResponseCode } from '../../../data/common';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import SqlAnalyze from '../SqlAnalyze';
import { AuditPlanReportSqlAnalyzeUrlParams } from './index.type';

const AuditPlanSqlAnalyze = () => {
  const urlParams = useParams<AuditPlanReportSqlAnalyzeUrlParams>();
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
      const res = await audit_plan.getAuditPlantAnalysisDataV2({
        project_name: projectName,
        audit_plan_report_id: urlParams.reportId ?? '',
        number: urlParams.sqlNum ?? '',
        audit_plan_name: urlParams.auditPlanName ?? '',
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
    startGetSqlAnalyze,
    projectName,
    urlParams.reportId,
    urlParams.sqlNum,
    urlParams.auditPlanName,
    getSqlAnalyzeFinish,
  ]);

  useEffect(() => {
    getSqlAnalyze();
  }, [getSqlAnalyze]);

  return (
    <SqlAnalyze
      tableMetas={tableMetas}
      sqlExplain={sqlExplain}
      errorType={errorType}
      errorMessage={errorMessage}
      performanceStatistics={performanceStatistics}
      loading={loading}
    />
  );
};

export default AuditPlanSqlAnalyze;
