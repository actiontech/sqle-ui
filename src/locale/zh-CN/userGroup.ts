// eslint-disable-next-line import/no-anonymous-default-export
export default {
  userGroupField: {
    userGroupName: '用户组名',
    userGroupDesc: '用户组描述',
    isDisabled: '禁用',
    isDisabledTips:
      '当用户组被禁用，组内用户不会被禁用，但会失去该用户组所关联的数据源及对应角色权限',
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
