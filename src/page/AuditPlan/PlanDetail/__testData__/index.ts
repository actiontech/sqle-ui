export const AuditPlanReportList = [
  {
    audit_plan_report_id: '177',
    score: 100,
    pass_rate: 1,
    audit_plan_report_timestamp: '2022-03-10T15:00:00+08:00',
  },
  {
    audit_plan_report_id: '176',
    audit_level: 'normal',
    pass_rate: 1,
    audit_plan_report_timestamp: '2022-03-10T14:00:00+08:00',
  },
  {
    audit_plan_report_id: '175',
    audit_level: 'normal',
    score: 100,
    audit_plan_report_timestamp: '2022-03-10T13:46:00+08:00',
  },
  {
    audit_plan_report_id: '174',
    audit_plan_report_timestamp: '2022-03-10T13:45:00+08:00',
  },
  {
    audit_plan_report_id: '173',
    audit_level: 'normal',
    score: 100,
    pass_rate: 1,
    audit_plan_report_timestamp: '2022-03-10T13:44:00+08:00',
  },
  {
    audit_plan_report_id: '172',
    audit_level: 'normal',
    score: 100,
    pass_rate: 1,
    audit_plan_report_timestamp: '2022-03-10T13:43:00+08:00',
  },
  {
    audit_plan_report_id: '171',
    audit_level: 'normal',
    score: 100,
    pass_rate: 1,
    audit_plan_report_timestamp: '2022-03-10T13:42:00+08:00',
  },
  {
    audit_plan_report_id: '170',
    audit_level: 'normal',
    score: 100,
    pass_rate: 1,
    audit_plan_report_timestamp: '2022-03-10T13:41:00+08:00',
  },
  {
    audit_plan_report_id: '169',
    audit_level: 'normal',
    score: 100,
    pass_rate: 1,
    audit_plan_report_timestamp: '2022-03-10T13:40:00+08:00',
  },
  {
    audit_plan_report_id: '168',
    audit_level: 'normal',
    score: 100,
    pass_rate: 1,
    audit_plan_report_timestamp: '2022-03-10T13:39:00+08:00',
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
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t42',
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t43',
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t44',
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t45',
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t46',
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t47',
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t48',
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t49',
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
  {
    audit_plan_report_sql: 'select * from t1 where id = t50',
    audit_plan_report_sql_audit_result: [
      {
        level: 'error',
        message:
          '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
        rule_name: 'all_check_where_is_invalid',
      },
    ],
  },
];
