// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '智能扫描',
  pageDesc:
    '你可以在这个查看/创建智能扫描任务，并配置审核周期去定期生成审核报告来检测SQL质量',

  list: {
    title: '扫描任务列表',

    table: {
      audit_plan_cron: '审核周期',
      audit_plan_db_type: '数据库类型',
      audit_plan_instance_database: '审核的数据库',
      audit_plan_instance_name: '数据源名称',
      audit_plan_name: '任务名称',
      audit_plan_token: '访问凭证',
      audit_plan_type: '任务类型',
      audit_rule_template: '审核规则模板',
    },
    operator: {
      notice: '订阅审核失败消息',
    },
  },

  action: {
    create: '创建扫描任务',
  },

  remove: {
    confirm: '您确认要移除扫描任务 {{name}} 么?',
    loading: '正在移除扫描任务{{name}}...',
    successTips: '移除扫描任务 {{name}} 成功',
  },

  create: {
    title: '创建扫描任务',
    successTitle: '创建扫描任务成功',
    successGuide: '到扫描任务列表查看刚刚添加的扫描任务',
  },

  update: {
    title: '更新扫描任务 {{name}}',
    successTitle: '更新扫描任务{{name}}成功',
    successGuide: '返回扫描任务列表',
  },

  planForm: {
    name: '任务名称',
    dbType: '数据库类型',
    databaseName: '数据源名称',
    cron: '任务审核周期',
    schema: '数据库',

    taskType: '任务类型',

    ruleTemplateName: '审核规则模版',
    ruleTemplateNameTips:
      '如果未指定此项会优先使用数据源绑定的模板, 如果数据源也未指定则使用数据类型默认模板',

    databaseNameTips:
      '如果您没有指定数据源，那么该扫描任务将使用您所选择的数据库类型的默认规则模版进行静态审核',
  },

  detailPage: {
    pageTitle: '任务名称: {{name}}',
    auditTaskType: '任务类型: {{type}}',
    pageDesc:
      '您可以在这里查看当前智能扫描任务的SQL统计信息，以及当前任务的审核记录',
  },

  sqlPool: {
    title: 'SQL统计信息',

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
    highRuleLevel: '审核中出现的最高错误等级',
  },

  planTaskRecord: {
    title: '审核记录',
  },

  report: {
    time: '报告生成时间: {{time}}',
    source: '审核报告评分: {{source}}',
    passRage: '审核通过率: {{rage}}',

    table: {
      sql: 'SQL语句',
      result: '审核结果',
      analyze: '分析',
    },
  },

  subscribeNotice: {
    title: '订阅审核失败消息',

    form: {
      interval: '推送间隔(分钟)',
      intervalTips:
        '推送间隔指的是两次推送之间的最短时间间隔，在推送过一次之后的“间隔时间”之内即使审核出现了错误也不会进行推送。直到间隔时间过了之后触发了新的错误之后才会进行下一次推送。如果你想接收所有推送可以将该间隔设置为0',

      level: '告警等级阈值',
      levelTips: '只有审核结果中包含高于或等于选择的告警等级的错误才会触发推送',

      emailEnable: '启用邮件推送',
      emailEnableTips: '邮件会发送给扫描任务创建人',

      webhooksEnable: '启用Webhooks推送',
      webhooksEnableCe: 'Webhooks推送为企业版功能',
      webhooksUrl: 'Webhooks url',
      webhooksTemplate: 'webhooks模版(json)',

      webhooksTemplateHelp: {
        title: '填写模版请遵循以下规则',
        rule1:
          '请填写正确的json格式的模版, 理论上不限制字段名，字段个数等规则。只需要保证json格式的正确性即可。',
        rule2: '推送时会自动替换模版中的变量,变更请参考下方的变量说明',

        supportVariable: '目前支持的变量',
        table: {
          desc: '变量描述',
          variable: '变量',
        },
        variable: {
          subject: '告警标题',
          body: '告警内容',
        },

        reset: '重置模版为默认模版',
      },

      test: '发送测试消息',
      testTips: '请先提交配置再进行测试',
      testLoading: '正在向扫描任务{{name}}的订阅配置发送测试消息...',
      testSuccess: '测试消息发送成功',
      subscribeNoticeSuccess: '订阅成功',
    },
  },
};
