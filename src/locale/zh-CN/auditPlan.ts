// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '审核计划',
  pageDesc: '你可以在这个查看/创建审核计划，以适用于你的定时审核任务',

  list: {
    title: '审核计划列表',

    table: {
      audit_plan_cron: '计划执行周期',
      audit_plan_db_type: '数据库类型',
      audit_plan_instance_database: '审核的数据库',
      audit_plan_instance_name: '数据源名称',
      audit_plan_name: '审核计划名称',
      audit_plan_token: '访问凭证',
    },
  },

  action: {
    create: '创建审核计划',
  },

  remove: {
    confirm: '您确认要移除审核计划 {{name}} 么?',
    loading: '正在移除审核计划{{name}}...',
    successTips: '移除审核计划 {{name}} 成功',
  },

  create: {
    title: '创建审核计划',
    successTitle: '创建审核计划成功',
    successGuide: '到审核计划列表查看刚昂添加的数据源',
  },

  update: {
    title: '更新审核计划 {{name}}',
    successTitle: '更新审核计划{{name}}成功',
    successGuide: '返回审核计划列表',
  },

  planForm: {
    name: '审核计划名称',
    dbType: '数据库类型',
    databaseName: '数据源名称',
    cron: '计划执行周期',
    schema: '数据库',
  },
};
