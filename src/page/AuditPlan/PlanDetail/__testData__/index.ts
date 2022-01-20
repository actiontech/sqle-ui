export const AuditPlanReportList = [
  {
    audit_plan_report_id: 31,
    audit_plan_report_timestamp: '2020-10-19T22:39:57+08:00',
  },
  {
    audit_plan_report_id: 32,
    audit_plan_report_timestamp: '2020-11-19T20:39:57+08:00',
  },
  {
    audit_plan_report_id: 33,
    audit_plan_report_timestamp: '2020-11-19T19:39:57+08:00',
  },
  {
    audit_plan_report_id: 34,
    audit_plan_report_timestamp: '2020-12-19T20:39:57+08:00',
  },
  {
    audit_plan_report_id: 35,
    audit_plan_report_timestamp: '2020-10-19T13:39:57+08:00',
  },
  {
    audit_plan_report_id: 36,
    audit_plan_report_timestamp: '2020-10-19T13:39:57+08:00',
  },
  {
    audit_plan_report_id: 37,
    audit_plan_report_timestamp: '2020-11-19T11:39:57+08:00',
  },
  {
    audit_plan_report_id: 38,
    audit_plan_report_timestamp: '2020-12-19T18:39:57+08:00',
  },
  {
    audit_plan_report_id: 39,
    audit_plan_report_timestamp: '2020-11-19T12:39:57+08:00',
  },
  {
    audit_plan_report_id: 40,
    audit_plan_report_timestamp: '2020-10-19T13:39:57+08:00',
  },
];

export const AuditPlanSqlsRes = {
  head: [
    { name: 'a', desc: '列a', type: 'sql' },
    { name: 'b', desc: '列b' },
  ],
  rows: [
    { a: 'select * from t1 where 1 = 1', b: 'b72' },
    { a: 'select * from t1 where 1 = 2', b: 'b74' },
    { a: 'select * from t1 where 1 = 3', b: 'b76' },
    { a: 'select * from t1 where 1 = 4', b: 'b78' },
    { a: 'select * from t1 where 1 = 5', b: 'b80' },
    { a: 'select * from t1 where 1 = 6', b: 'b82' },
    { a: 'select * from t1 where 1 = 7', b: 'b84' },
    { a: 'select * from t1 where 1 = 8', b: 'b86' },
    { a: 'select * from t1 where 1 = 9', b: 'b88' },
    { a: 'select * from t1 where 1 = 10', b: 'b90' },
  ],
};
export const AuditReport = [
  {
    audit_plan_report_sql: 'select * from t1 where id = t41',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t42',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t43',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t44',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t45',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t46',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t47',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t48',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t49',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t50',
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
  },
];
