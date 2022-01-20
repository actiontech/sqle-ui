export const auditTaskMetas = [
  {
    audit_plan_params: [
      { desc: '字段a', key: 'a', type: 'string', value: '123' },
      { desc: '字段b', key: 'b', type: 'int', value: '123' },
      { desc: '字段c', key: 'c', type: 'bool', value: 'true' },
    ],
    audit_plan_type: 'normal',
    audit_plan_type_desc: '普通的SQL审核',
    instance_type: 'mysql',
  },
  {
    audit_plan_params: [
      { desc: '字段d', key: 'd', type: 'string', value: '123' },
      { desc: '字段e', key: 'e', type: 'int', value: '123' },
      { desc: '字段f', key: 'f', type: 'bool', value: 'true' },
    ],
    audit_plan_type: 'slowLog',
    audit_plan_type_desc: '慢日志审核',
    instance_type: 'mysql',
  },
];
