// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL查询',
  pageDescribe: '你可以对你有权访问的数据源进行SQL查询',
  ceTips:
    'SQL查询为企业版功能。如果您要想使用这些功能，您可以按照以下链接中的商业支持里的联系方式进行咨询。',
  sqlInput: {
    title: 'SQL录入',
    instance: '数据源',
    database: '数据库',
    returnLength: '返回行数',
    searchSqlResult: '查询',
    sqlHistory: '历史记录',
    returnLengthTips: '返回行数的最大值可通过数据源配置的修改',
    returnLengthCheck: '请输入返回行数',
  },
  sqlQueryHistory: {
    title: 'Sql查询历史记录',
    applySql: '应用',
    filterSqlHistory: '查询',
  },
  executeResult: {
    title: '执行结果',
    errorMessageTitle: '查询出现错误',
    resultTitle: '结果{{index}}',
    paginationInfo:
      '当前数据为第{{current_page}}页, 显示第{{start_line}}至{{end_line}}条记录, 查询耗时{{execution_time}}ms',
  },
};
