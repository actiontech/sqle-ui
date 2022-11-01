// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '用户组管理',
  pageDesc:
    '您可以在这里创建/编辑用户组，并为用户组绑定角色和用户，用户组中的用户拥有用户组中的所有角色的权限并集。',

  userGroupField: {
    userGroupName: '用户组名',
    userGroupDesc: '用户组描述',
    isDisabled: '禁用',
    userNameList: '绑定用户',
  },

  userGroupState: {
    disabled: '禁用',
    normal: '正常',
  },

  userGroupList: {
    title: '用户组列表',

    isDisabled: '是否禁用',
  },

  createUserGroup: {
    title: '创建用户组',
    successTips: '创建用户组 "{{name}}" 成功',
  },

  updateUserGroup: {
    title: '编辑用户组',
    successTips: '编辑用户组 "{{name}}" 成功',
  },

  deleteUserGroup: {
    confirm: '确认要删除用户组: "{{name}}" 吗？',
    deleting: '正在删除用户组: "{{name}}" ...',
    deleteSuccess: '删除用户组: "{{name}}" 成功',
  },
};
