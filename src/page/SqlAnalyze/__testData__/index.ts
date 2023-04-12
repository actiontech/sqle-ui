import { sqlExecPlans, tableSchemas } from '../../SqlQuery/__testData__';

export const AuditPlanSqlAnalyzeData = {
  sql_explain: {
    sql: sqlExecPlans[0].sql,
    classic_result: sqlExecPlans[0].classic_result,
    performance_statistics: {
      affect_rows: {
        count: 10,
        err_message: '',
      },
    },
  },
  table_metas: {
    err_message: '',
    table_meta_items: tableSchemas.map((e) => e.tableMeta),
  },
};
