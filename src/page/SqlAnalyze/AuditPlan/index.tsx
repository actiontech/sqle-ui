import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/lib/result';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import audit_plan from '../../../api/audit_plan';
import { ISQLExplain, ITableMeta } from '../../../api/common';
import { ResponseCode } from '../../../data/common';
import SqlAnalyze from '../SqlAnalyze';
import { AuditPlanReportSqlAnalyzeUrlParams } from './index.type';

const AuditPlanSqlAnalyze = () => {
  const urlParams = useParams<AuditPlanReportSqlAnalyzeUrlParams>();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [sqlExplain, setSqlExplain] = useState<ISQLExplain>();
  const [tableSchemas, setTableSchemas] = useState<ITableMeta[]>([]);
  const [
    loading,
    { setTrue: startGetSqlAnalyze, setFalse: getSqlAnalyzeFinish },
  ] = useBoolean();

  const [errorType, setErrorType] = useState<ResultStatusType>('error');

  const getSqlAnalyze = useCallback(async () => {
    startGetSqlAnalyze();
    try {
      const res = await audit_plan.getTaskAnalysisData({
        audit_plan_report_id: urlParams.reportId,
        number: urlParams.sqlNum,
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        setErrorMessage('');
        setSqlExplain(res.data.data?.sql_explain);
        setTableSchemas(res.data.data?.table_metas ?? []);
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
    urlParams.reportId,
  ]);

  useEffect(() => {
    getSqlAnalyze();
  }, [getSqlAnalyze]);

  return (
    <SqlAnalyze
      tableSchemas={tableSchemas}
      sqlExplain={sqlExplain}
      errorType={errorType}
      errorMessage={errorMessage}
      loading={loading}
    />
  );
};

export default AuditPlanSqlAnalyze;
