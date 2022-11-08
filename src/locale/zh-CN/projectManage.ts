// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '项目管理',
  pageDescribe:
    '从项目维度组织管理SQLe平台的资源和功能，以项目为入口支持各种审核功能，不同项目之间资源隔离。',

  projectList: {
    title: '项目列表',
    deleteSuccessTips: '删除项目{{name}}成功',
    createProject: '创建项目',
    column: {
      name: '项目名称',
      desc: '项目描述',
      createTime: '创建时间',
      createUser: '创建人',
    },
  },
  createProject: {
    modalTitle: '创建项目',
    createSuccessTips: '创建项目{{name}}成功',
  },
  updateProject: {
    modalTitle: '编辑项目',
    updateSuccessTips: '更新项目{{name}}成功',
  },

  projectForm: {
    projectName: '项目名称',
    projectDesc: '项目描述',
  },

  projectInfoBox: {
    title: '{{name}}',
    desc: '项目描述: {{desc}}',
    createTime: '创建时间: {{time}}',
    createUser: '创建人: {{user}}',
  },
};
