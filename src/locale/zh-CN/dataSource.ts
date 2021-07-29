// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '数据源',
  pageDesc: '你可以在这里注册需要进行SQL审核的数据库。',

  databaseListTitle: '数据源列表',

  databaseList: {
    instanceName: '数据源名',
    address: '地址',
    describe: '描述',
    role: '角色',
    ruleTemplate: '模版',
    workflow: '工作流',
  },

  addDatabase: '添加数据源',
  addDatabaseSuccess: '添加数据源成功',
  addDatabaseSuccessGuide: '到数据源列表查看刚刚添加的数据源',

  updateDatabase: {
    getDatabaseInfoError: '获取数据源信息失败了',
    updateDatabaseTitle: '更新数据源',
    updateDatabaseSuccess: '数据源"{{name}}"更新成功',
  },

  dataSourceForm: {
    name: '数据源名称',
    describe: '数据源描述',
    type: '数据库类型',
    ip: '数据库IP',
    port: '数据库端口',
    user: '链接用户',
    password: '密码',
    role: '可访问的角色',
    ruleTemplate: '审核规则模版',
    workflow: '应用的工作流',

    passwordTips:
      '这里不会显示您已经配置的当前数据库密码，提交时如果您没有填写密码，那么将不会对数据库密码进行变更。',
    testDatabaseConnection: '测试数据库连通性',
    testing: '正在尝试进行连接...',
    testSuccess: '数据库连通性测试成功',
    testFailed: '未能成功链接到数据库',
  },

  testConnectModal: {
    errorTitle: '数据库{{instanceName}}连通性测试失败',
  },

  deleteDatabase: {
    confirmMessage: '确认删除数据源 "{{name}}"?',
    deletingDatabase: '正在删除数据源 "{{name}}"...',
    deleteSuccessTips: '删除数据源"{{name}}"成功',
  },
};
