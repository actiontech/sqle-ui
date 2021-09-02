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

export const AuditPlanSqls = [
  {
    audit_plan_sql_counter: 18,
    audit_plan_sql_fingerprint: 'select * from t11 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t12',
    audit_plan_sql_last_receive_timestamp: '2020-11-19T12:39:57+08:00',
  },
  {
    audit_plan_sql_counter: 89,
    audit_plan_sql_fingerprint: 'select * from t13 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t14',
    audit_plan_sql_last_receive_timestamp: '2020-10-19T12:39:57+08:00',
  },
  {
    audit_plan_sql_counter: 60,
    audit_plan_sql_fingerprint: 'select * from t15 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t16',
    audit_plan_sql_last_receive_timestamp: '2020-11-19T23:39:57+08:00',
  },
  {
    audit_plan_sql_counter: 6,
    audit_plan_sql_fingerprint: 'select * from t17 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t18',
    audit_plan_sql_last_receive_timestamp: '2020-11-19T20:39:57+08:00',
  },
  {
    audit_plan_sql_counter: 71,
    audit_plan_sql_fingerprint: 'select * from t19 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t20',
    audit_plan_sql_last_receive_timestamp: '2020-12-19T22:39:57+08:00',
  },
  {
    audit_plan_sql_counter: 2,
    audit_plan_sql_fingerprint: 'select * from t21 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t22',
    audit_plan_sql_last_receive_timestamp: '2020-10-19T10:39:57+08:00',
  },
  {
    audit_plan_sql_counter: 92,
    audit_plan_sql_fingerprint: 'select * from t23 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t24',
    audit_plan_sql_last_receive_timestamp: '2020-10-19T19:39:57+08:00',
  },
  {
    audit_plan_sql_counter: 41,
    audit_plan_sql_fingerprint: 'select * from t25 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t26',
    audit_plan_sql_last_receive_timestamp: '2020-12-19T12:39:57+08:00',
  },
  {
    audit_plan_sql_counter: 71,
    audit_plan_sql_fingerprint: 'select * from t27 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t28',
    audit_plan_sql_last_receive_timestamp: '2020-10-19T16:39:57+08:00',
  },
  {
    audit_plan_sql_counter: 22,
    audit_plan_sql_fingerprint: 'select * from t29 where id = ?',
    audit_plan_sql_last_receive_text: 'select * from t1 where id = t30',
    audit_plan_sql_last_receive_timestamp: '2020-11-19T23:39:57+08:00',
  },
];

export const AuditReport = [
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t41 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t42',
    audit_plan_report_sql_last_receive_timestamp: '2020-10-19T14:39:57+08:00',
  },
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t43 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t44',
    audit_plan_report_sql_last_receive_timestamp: '2020-11-19T17:39:57+08:00',
  },
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t45 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t46',
    audit_plan_report_sql_last_receive_timestamp: '2020-12-19T12:39:57+08:00',
  },
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t47 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t48',
    audit_plan_report_sql_last_receive_timestamp: '2020-11-19T16:39:57+08:00',
  },
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t49 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t50',
    audit_plan_report_sql_last_receive_timestamp: '2020-12-19T11:39:57+08:00',
  },
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t51 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t52',
    audit_plan_report_sql_last_receive_timestamp: '2020-10-19T15:39:57+08:00',
  },
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t53 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t54',
    audit_plan_report_sql_last_receive_timestamp: '2020-11-19T21:39:57+08:00',
  },
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t55 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t56',
    audit_plan_report_sql_last_receive_timestamp: '2020-11-19T21:39:57+08:00',
  },
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t57 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t58',
    audit_plan_report_sql_last_receive_timestamp: '2020-10-19T22:39:57+08:00',
  },
  {
    audit_plan_report_sql_audit_result:
      '[error]禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql\n[notice]不建议使用select *\n[warn]CPU心情不太好\n[normal]所以CPU出门散心去了',
    audit_plan_report_sql_fingerprint: 'select * from t59 where id = ?',
    audit_plan_report_sql_last_receive_text: 'select * from t1 where id = t60',
    audit_plan_report_sql_last_receive_timestamp: '2020-11-19T22:39:57+08:00',
  },
];
