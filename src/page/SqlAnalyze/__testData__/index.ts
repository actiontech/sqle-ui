import { sqlExecPlans, tableSchemas } from '../../SqlQuery/__testData__';

export const AuditPlanSqlAnalyzeData = {
  sql_explain: {
    sql: sqlExecPlans[0].sql,
    classic_result: sqlExecPlans[0].classic_result,
  },
  table_metas: tableSchemas.map((e) => e.tableMeta),
};
