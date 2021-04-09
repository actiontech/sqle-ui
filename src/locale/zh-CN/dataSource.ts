// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '数据源',
  pageDesc: '你可以在这里注册需要进行SQL审核的数据库。',

  databaseListTitle: '数据库列表',

  databaseList: {
    instanceName: '数据库名',
    address: '地址',
    describe: '描述',
    role: '角色',
    ruleTemplate: '模版',
    workflow: '工作流',
  },

  addDatabase: '添加数据源',
  addDatabaseSuccess: '添加数据库成功',
  addDatabaseSuccessGuide: '到数据源列表查看刚刚添加的数据库',

  updateDatabase: {
    getDatabaseInfoError: '获取数据库实例信息失败了',
    updateDatabaseTitle: '更新数据源',
    updateDatabaseSuccess: '数据库"{{name}}"更新成功',
  },

  dataSourceForm: {
    name: '数据库名称',
    describe: '数据库描述',
    ip: '数据库IP',
    port: '数据库端口',
    user: '链接用户',
    password: '密码',
    role: '可访问的角色',
    ruleTemplate: '审核规则模版',
    workflow: '应用的工作流',

    testDatabaseConnection: '测试数据库连通性',
    testing: '正在尝试进行连接...',
    testSuccess: '数据库连通性测试成功',
    testFailed: '未能成功链接到数据库',
  },

  testConnectModal: {
    errorTitle: '数据库{{instanceName}}连通性测试失败',
  },

  deleteDatabase: {
    confirmMessage: '确认删除数据库 "{{name}}"?',
    deletingDatabase: '正在删除数据库 "{{name}}"...',
    deleteSuccessTips: '删除数据库"{{name}}"成功',
  },
};
