// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '项目管理',
  pageDescribe:
    '从项目维度组织管理SQLe平台的资源和功能，以项目为入口支持各种审核功能，不同项目之间资源隔离。',

  projectList: {
    title: '项目列表',
    deleteSuccessTips: '删除项目{{name}}成功',
    createProject: '创建项目',
    archiveProjectSuccessTips: '冻结项目"{{name}}"成功',
    unarchiveProjectSuccessTips: '启用项目"{{name}}"成功',
    column: {
      name: '项目名称',
      desc: '项目描述',
      status: '项目状态',
      createTime: '创建时间',
      createUser: '创建人',
      available: '可用',
      unavailable: '不可用',
      deleteProjectTips: '确认要删除项目"{{name}}"么?',
      archive: '冻结',
      unarchive: '启用',
      archiveProjectTips: '确认要冻结项目"{{name}}"么?',
      unarchiveProjectTips: '确认要启用项目"{{name}}"么?',
    },
    allProject: '查看所有项目',

    searchProject: {
      placeholder: '搜索您的项目',
      recentlyOpenedProjects: '最近打开的项目',
      notSearched: '未搜索到符合条件的项目',
      notRecentlyOpenedProjects: '暂无最近打开的项目',
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
    name: '项目名称: {{name}}',
    desc: '项目描述: {{desc}}',
    createTime: '创建时间: {{time}}',
    createUser: '创建人: {{user}}',
  },

  projectDetail: {
    notice: '提示',
    unboundProjectTips: '当前用户暂未绑定项目, 请联系项目管理员',
  },

  projectOverview: {
    pageTitle: '项目概览',
    orderTotal: '工单总数',
    auditPlanTotal: '扫描任务总数',
    instanceTotal: '数据源总数',
    memberTotal: '成员总数',
    ruleTemplateTotal: '规则模板总数',
    whiteListTotal: '白名单总数',

    projectScore: {
      title: '项目评分',
    },
    sqlCount: {
      title: 'SQL',
      riskRate: '风险率',
      SQLCount: 'SQL总数',
      riskSQL: '风险SQL',
    },
    dataSourceCount: {
      title: '数据源',
      health: '健康实例',
      risk: '风险实例',
      tips: '当实例上存在工单上线失败/被驳回、扫描扫描任务最新报告评分<60时，该实例为风险实例',
      riskNum: '风险实例 {{num}} 个',
      healthNum: '健康实例 {{num}} 个',
    },
    orderClassification: {
      title: '工单',
    },
    orderRisk: {
      title: '工单潜在风险',
      tableColumn: {
        name: '工单',
        status: '状态',
        time: '时间',
        createUser: '创建人',
      },
    },
    auditPlanClassification: {
      title: '扫描任务',
    },
    auditPlanRisk: {
      title: '扫描任务潜在风险',
      tableColumn: {
        name: '扫描任务报告',
        source: '来源',
        time: '时间',
        count: '风险SQL',
      },
    },
    memberInfo: {
      title: '成员',
      count: '成员数量',
      action: '编辑成员',
    },
    approvalProcess: {
      title: '审批流程',
      action: '编辑当前审批流程模板',
      createStep: '工单发起',
      review: '工单审批',
      exec: '工单上线',
      match: '匹配权限',
    },
  },
};
