// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '角色管理',
  pageDesc: '您可以在这个创建/编辑角色，并为角色分配数据源和部分工单操作权限。',

  roleListTitle: '角色列表',

  createRole: {
    button: '创建角色',
    modalTitle: '创建角色',
    createSuccessTips: '创建角色 "{{name}}" 成功',
  },

  updateRole: {
    modalTitle: '更新角色',
    updateSuccessTips: '更新角色 "{{name}}" 成功',
  },

  deleteRole: {
    deleteTips: '确认要删除角色 "{{name}}"?',
    deleting: '正在删除角色 "{{name}}"...',
    deleteSuccessTips: '删除角色 "{{name}}" 成功',
  },

  roleForm: {
    roleName: '角色名',
    roleDesc: '角色描述',
    databases: '数据源',
    usernames: '绑定用户',
    operationCodes: '动作权限',
    userGroups: '所属用户组',
  },

  roleListFilter: {
    usernamePlaceholder: '请输入要搜索的用户名',
    rolePlaceholder: '请输入要搜索的角色',
    databasePlaceholder: '请输入要搜索的数据源',
  },

  roleList: {
    username: '绑定的用户',
    database: '绑定的数据源',
    userGroup: '绑定的用户组',
    operation: '拥有的动作权限',
  },
};
