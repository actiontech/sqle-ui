// eslint-disable-next-line import/no-anonymous-default-export
export default {
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
    title: '审核通过率/上线成功率',
  },
  orderQuantityTrend: {
    title: '工单趋势',
  },
  orderStatus: {
    title: '工单状态',
    closed: '已关闭',
    executing: '上线中',
    executionSuccess: '上线成功',
    rejected: '被驳回',
    waitingForAudit: '待审核',
    waitingForExecution: '待上线',
  },
  orderDbTypeScale: {
    title: '按数据库类型的工单占比',
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
};
