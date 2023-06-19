// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageDesc:
    '您可以在这里查看平台的整体情况，由此了解SQL审核效率以及提交的SQL质量。',
  ceTips:
    '如果管理员需要全面了解平台业务的审核进度以及平台的使用情况，可以使用报表统计功能。\n该功能提供多维度的业务分析视角，协助管理员了解工单的审核效率和提交的SQL质量，从而更高效、灵活地开展SQL审核工作。',
  title: '报表统计',
  titleTips: '当前页面统计信息不包含已被回收的数据',
  orderTotalNumbers: {
    title: '工单总数/今日新增',
  },
  orderAverageReviewTime: {
    title: '工单平均审核时间',
  },
  orderAverageExecuteTime: {
    title: '工单平均上线时间',
  },
  orderPassRate: {
    title: '审核通过率',
  },
  orderQuantityTrend: {
    title: '工单趋势',
  },
  orderStatus: {
    title: '工单状态',
    closed: '已关闭',
    executing: '上线中',
    executionSuccess: '上线成功',
    executionFailed: '上线失败',
    rejected: '被驳回',
    waitingForAudit: '待审核',
    waitingForExecution: '待上线',
  },
  orderDbTypeScale: {
    title: '按数据库类型的工单构成',
    tips: '一个工单，存在不同数据库类型的多个数据源，则按数据库类型分别计算工单数',
  },
  orderInstanceTypeScale: {
    title: '按数据库类型的数据源构成',
  },
  licenseUsage: {
    title: 'License使用情况',
  },
  diffUserOrderRejectRate: {
    title: '不同用户工单驳回率(Top{{tableLimit}})',
    titleTips: 'Top10',
    columns: {
      username: '用户名',
      totalOrder: '工单总数',
      rejectRate: '驳回率',
    },
  },
  diffInstanceOrderRejectRate: {
    title: '不同数据源工单驳回率(Top{{tableLimit}})',
    titleTips: 'Top10',
    columns: {
      instanceName: '数据源名',
      totalOrder: '工单总数',
      rejectRate: '驳回率',
    },
  },
  orderAverageExecuteTimeTopN: {
    title: 'SQL上线平均耗时 (Top{{tableLimit}})',
    columns: {
      dataSourceName: '数据源名称',
      average: '平均上线耗时',
      max: '最长上线耗时',
      min: '最短上线耗时',
    },
  },
  sqlExecFailedTopN: {
    title: 'SQL上线失败率 (Top{{tableLimit}})',
    columns: {
      dataSourceName: '数据源名称',
      sqlExecFailedPercent: '上线失败率',
    },
  },
};
