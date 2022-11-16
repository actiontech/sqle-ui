/* eslint-disable import/no-anonymous-default-export */
export default {
  pageTitle: '项目成员管理',

  memberList: {
    title: '成员列表',
    createAction: '添加成员',
    deleteSuccessTips: '删除成员{{name}}成功',

    tableColumn: {
      username: '用户名',
      role: '角色',
      isManager: '项目拥有者',
      confirmTitle: '确定要删除成员:{{name}}?',
    },

    filterForm: {
      username: '用户名',
      instance: '数据源',
    },
  },

  memberGroupList: {
    title: '成员组列表',
    createAction: '添加成员组',
    deleteSuccessTips: '删除成员组{{name}}成功',

    tableColumn: {
      userGroupName: '用户组名',
      role: '角色',
      confirmTitle: '确定要删除成员组:{{name}}?',
    },

    filterForm: {
      userGroupName: '用户组名',
      instance: '数据源',
    },
  },

  addMember: {
    modalTitle: '添加成员',
    successTips: '添加成员{{name}}成功',
  },

  addMemberGroup: {
    modalTitle: '添加成员组',
    successTips: '添加成员组{{name}}成功',
  },

  updateMember: {
    modalTitle: '更新成员',
    successTips: '更新成员{{name}}成功',
  },

  updateMemberGroup: {
    modalTitle: '更新成员组',
    successTips: '更新成员组{{name}}成功',
  },

  memberForm: {
    username: '用户名',
    projectAdmin: '项目管理员',
  },

  memberGroupForm: {
    userGroupName: '用户组名',
  },

  roleSelector: {
    role: '角色',
    instance: '数据源',
  },
};
