// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL工作台',
  pageDescribe: '你可以对你有操作权限的数据源进行受审核管控的SQL操作',
  eeErrorTips: '该环境未配置SQL查询，请设置后再使用',
  eeErrorTips2: '配置方式及使用说明请查看使用文档',

  jumpToCloudbeaver: '打开SQL工作台',

  databaseTables: {
    title: '数据库表',
    tabTitle: '{{tableName}}结构',
    columns: '列信息',
    index: '索引信息',
    createdTableSql: '建表语句',
  },
  executeResult: {
    title: '执行结果',
    errorMessageTitle: '查询出现错误',
    resultTitle: '结果{{index}}',
    paginationInfo:
      '当前数据为第{{current_page}}页, 显示第{{start_line}}至{{end_line}}条记录, 查询耗时{{execution_time}}ms',
  },
  executePlan: {
    title: '执行计划{{index}}',
    sql: 'SQL语句',
    sqlExplain: '执行计划',
  },
};
