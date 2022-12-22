// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '用户中心',
  pageDesc: '您可以在用户中心管理平台用户、用户组，并配置平台角色权限。',
  userListTitle: '用户列表',

  createUser: {
    button: '创建用户',
    modalTitle: '创建用户',
    createSuccessTips: '创建用户 "{{name}}" 成功',
  },

  updateUser: {
    modalTitle: '更新用户',
    updateSuccessTips: '更新用户 "{{name}}" 成功',
  },

  updateUserPassword: {
    button: '修改该用户密码',
    title: '修改{{name}}用户密码',

    successTips: '修改{{name}}用户密码成功',
  },

  table: {
    userType: '用户类型',
    status: '用户状态',
    operation: '平台管理权限',
  },

  userState: {
    normal: '正常',
    disabled: '已禁用',
  },

  userForm: {
    username: '用户名',
    password: '密码',
    passwordConfirm: '确认密码',
    email: '邮箱',
    role: '角色',
    disabled: '禁用用户',
    userGroup: '所属用户组',
    wechat: '微信id',
    managerPermission: '平台管理权限',
    phone: '手机号',

    passwordConfirmPlaceholder: '请保持两次密码输入一致',
  },

  userListFilter: {
    usernamePlaceholder: '请输入要搜索的用户名',
    rolePlaceholder: '请输入要搜索的角色',
  },

  deleteUser: {
    confirmTitle: '确认要删除用户: "{{username}}"?',
    deleting: '正在删除用户: "{{username}}...',
    deleteSuccess: '删除用户 "{{username}}" 成功',
  },

  userList: {
    emailPlaceholder: '未填写邮箱',
    rolePlaceHolder: '未拥有任何角色',
    role: '拥有角色',
  },
};
