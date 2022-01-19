// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '审核任务',
  pageDesc: '你可以在这个查看/创建审核任务，以适用于你的定时审核任务',

  list: {
    title: '审核任务列表',

    table: {
      audit_plan_cron: '任务审核周期',
      audit_plan_db_type: '数据库类型',
      audit_plan_instance_database: '审核的数据库',
      audit_plan_instance_name: '数据源名称',
      audit_plan_name: '审核任务名称',
      audit_plan_token: '访问凭证',
      audit_plan_type: '审核任务类型',
    },
  },

  action: {
    create: '创建审核任务',
  },

  remove: {
    confirm: '您确认要移除审核任务 {{name}} 么?',
    loading: '正在移除审核任务{{name}}...',
    successTips: '移除审核任务 {{name}} 成功',
  },

  create: {
    title: '创建审核任务',
    successTitle: '创建审核任务成功',
    successGuide: '到审核任务列表查看刚刚添加的审核任务',
  },

  update: {
    title: '更新审核任务 {{name}}',
    successTitle: '更新审核任务{{name}}成功',
    successGuide: '返回审核任务列表',
  },

  planForm: {
    name: '审核任务名称',
    dbType: '数据库类型',
    databaseName: '数据源名称',
    cron: '任务审核周期',
    schema: '数据库',

    databaseNameTips:
      '如果您没有指定数据源，那么该审核任务将使用您所选择的数据库类型的默认规则模版进行静态审核',
  },

  detailPage: {
    pageTitle: '审核任务: {{name}}',
    auditTaskType: '审核任务类型: {{type}}',
    pageDesc:
      '您可以在这个查看当前审核任务的SQL语句池中的语句，以及当前审核任务的审核记录',
  },

  sqlPool: {
    title: '当前审核任务SQL语句池',

    table: {
      fingerprint: 'SQL指纹',
      lastReceiveText: '最后一次匹配到该指纹的语句',
      lastReceiveTime: '最后一次匹配到该指纹的时间',
      count: '匹配到该指纹的语句数量',
    },

    action: {
      trigger: '立即审核',

      loading: '正在触发审核...',
      triggerSuccess: '审核触发成功',
    },
  },

  record: {
    generateTime: '生成时间',
  },

  planTaskRecord: {
    title: '审核记录',
  },

  report: {
    title: '审核报告: {{id}}',

    table: {
      sql: 'SQL语句',
      result: '审核结果',
    },
  },
};
