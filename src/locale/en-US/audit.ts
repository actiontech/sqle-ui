// eslint-disable-next-line import/no-anonymous-default-export
export default {
  result: '审核结果',
  passRage: '审核通过率',
  source: '审核结果评分',
  duplicate: '是否去重',
  downloadSql: '下载SQL语句',
  downloadReport: '下载审核报告',
  table: {
    number: '序号',
    auditLevel: '规则等级',
    auditStatus: '审核状态',
    auditResult: '审核结果',
    execSql: '执行语句',
    execStatus: '执行状态',
    execResult: '执行结果',
    rollback: '回滚语句',
    rollbackTips: '仅提示，不支持执行回滚',
    describe: '说明',
    analyze: '分析',
  },

  execStatus: {
    initialized: '准备执行',
    doing: '正在执行',
    succeeded: '执行成功',
    failed: '执行失败',
    manually_executed: '人工执行',
  },

  auditStatus: {
    initialized: '准备审核',
    doing: '正在审核',
    finished: '审核完毕',
  },
};
