/* eslint-disable import/no-anonymous-default-export */
export default {
  pageTitle: 'SQL管控',
  pageDesc: '您可以在此监控扫描任务和API审核中的SQL及其审核结果',
  eeFeatureDescription:
    'SQL管控为用户提供SQL全生命周期监控，面板将整合所有的业务SQL，用户可以在该面板中查看项目中采集并审核的所有SQL，暴露其中的问题SQL，同时支持用户解决问题SQL。',

  statistics: {
    SQLTotalNum: 'SQL总数',
    problemSQlNum: '问题SQL数',
    optimizedSQLNum: '已优化SQL数',
  },

  selectDictionary: {
    auditPlan: '智能扫描',
    apiAudit: 'SQL审核',

    normal: '普通',
    error: '错误',
    warn: '告警',
    notice: '提示',

    unhandled: '未处理',
    solved: '已解决',
    ignored: '已忽略',
  },

  filterForm: {
    SQLFingerprint: 'SQL指纹',
    fuzzySearchPlaceholder: '请输入SQL指纹或负责人名称',
    instanceName: '数据源',
    source: '来源',
    highAuditLevel: '最高审核等级',
    status: '状态',
    relatedToMe: '与我相关',
    time: '时间范围',
  },

  table: {
    SQLFingerprint: 'SQL指纹',
    source: '来源',
    instanceName: '数据源',
    auditResult: '审核结果',
    firstOccurrence: '初次出现时间',
    lastOccurrence: '最后一次出现时间',
    occurrenceCount: '出现数量',
    personInCharge: '负责人',
    status: '状态',
    comment: '备注',

    actions: {
      batchAssignment: '批量指派',
      batchSolve: '批量解决',
      batchIgnore: '批量忽略',
    },
  },
};
