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
    manualAudited: '已人工审核',
  },

  filterForm: {
    SQLFingerprint: 'SQL指纹',
    fuzzySearchPlaceholder: '请输入SQL指纹或负责人名称',
    instanceName: '数据源',
    source: '来源',
    auditLevel: '最低审核等级',
    status: '状态',
    relatedToMe: '与我相关',
    time: '时间范围',
    rule: '审核规则',
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
      batchAssignmentSuccessTips: '批量指派负责人成功',
      signalAssignmentSuccessTips: '指派负责人成功',
      signalUpdateStatusSuccessTips: '更新SQL状态成功',
      batchSolve: '批量解决',
      batchSolveTips: '是否确认将所选SQL设为已解决?',
      batchSolveSuccessTips: '批量解决SQL成功',
      batchIgnore: '批量忽略',
      batchIgnoreTips: '是否确认将所选SQL设为已忽略?',
      batchIgnoreSuccessTips: '批量忽略SQL成功',
      export: '导出',
      exporting: '正在导出文件',
      exportSuccessTips: '导出文件成功',
    },

    assignMember: {
      label: '指派负责人',
    },
    updateStatus: {
      triggerText: '变更状态',
      label: '变更当前SQL状态',
      solve: '解决',
      ignore: '忽略',
      manualAudit: '人工审核',
    },
  },
};
