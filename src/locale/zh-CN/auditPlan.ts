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

    databaseNameTips:
      '如果您没有指定数据源，那么该审核计划将使用您所选择的数据库类型的默认规则模版进行静态审核',
  },

  detailPage: {
    pageTitle: '审核计划: {{name}}',
    pageDesc:
      '您可以在这个查看当前审核计划的SQL语句池中的语句，以及当前审核计划的审核记录',
  },

  sqlPool: {
    title: '当前审核计划SQL语句池',

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

  planTaskRecord: {
    title: '审核记录',
  },

  report: {
    title: '审核报告: {{id}}',

    table: {
      fingerprint: 'SQL指纹',
      lastReceiveText: '最后一次匹配到该指纹的语句',
      lastReceiveTime: '最后一次匹配到该指纹的时间',
      result: '审核结果',
    },
  },
};
