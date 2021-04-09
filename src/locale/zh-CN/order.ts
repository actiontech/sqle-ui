// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '工单详情',
  orderList: {
    pageTitle: '工单列表',
    pageDesc: '工单列表中只会展示与您相关的工单。',

    allOrderAboutMe: '所有与我相关的工单',
  },
  createOrder: {
    title: '创建工单',
    pageDesc: '您可以在这里选择数据源进行创建SQL审核工单',
  },
  order: {
    name: '工单名称',
    createUser: '创建人',
    assignee: '待操作人',
    createTime: '创建时间',
    desc: '工单描述',
    status: '工单状态',
    stepType: '当前步骤类型',
    sqlTaskStatus: 'Sql审核状态',
    instanceName: '数据源',
    passRate: '审核通过率',
  },

  status: {
    canceled: '已关闭',
    finished: '已上线',
    process: '待审核',
    reject: '已驳回',
  },

  sqlTaskStatus: {
    initialized: '等待审核',
    audited: '审核完成',
    executing: '执行中',
    execSuccess: '执行成功',
    execFailed: '执行失败',
  },

  operator: {
    title: '工单进度',
    time: '操作时间',
    user: '操作人',
    reject: '驳回',
    createOrder: '{{name}}创建了当前工单',
    wait: '正在等待用户{{username}}进行操作',
    rejectDetail: '{{name}}驳回了当前工单，驳回原因为',
    sqlExecute: '执行上线',
    unknown: '未知步骤',

    approveSuccessTips: '审批通过',
    rejectSuccessTips: '驳回成功',
    rejectReason: '驳回原因',
  },

  create: {
    success: '工单创建成功',
    guide: '去工单详情查看刚刚创建的工单',
  },

  baseInfo: {
    title: '工单基本信息',

    name: '工单名称',
    describe: '工单描述',
  },

  sqlInfo: {
    title: '审核SQL语句信息',

    instanceName: '数据源',
    instanceSchema: '数据库',
    sql: 'SQL语句',
    sqlFile: 'SQL文件',

    uploadType: '选择审核SQL语句上传方式',
    manualInput: '输入SQL语句',
    uploadFile: '上传SQL文件',

    audit: '审核',
  },

  workflowStatus: {
    review: '待审核',
    exec: '待上线',
  },
};
