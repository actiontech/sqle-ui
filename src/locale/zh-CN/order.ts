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
    dirtyDataTips:
      '检测到您在审核SQL语句之后,又修改了‘审核SQL语句信息’表单中的内容并且没有再点击审核，现在会使用当前审核结果表格中的SQL语句进行创建工单，您确认这样做么？',
    unsupportMybatisTips: '暂时不支持创建SQL语句类型为Mybatis的工单',
    mustAuditTips: '您必须先对您的SQL进行审核才能进行创建工单',
    mustHaveAuditResultTips: '不能对审核结果为空的SQL进行创建工单',
  },
  closeOrder: {
    button: '关闭工单',
    closeConfirm: '您确认关闭当前工单？',
  },
  history: {
    title: '工单操作历史',
    showHistory: '查看工单操作历史',
  },
  order: {
    name: '工单名称',
    dataSource: '数据源',
    schema: '数据库',
    createUser: '创建人',
    assignee: '待操作人',
    createTime: '创建时间',
    executeTime: '上线时间',
    desc: '工单描述',
    status: '工单状态',
    time: '定时时间',
    stepType: '当前步骤类型',
    sqlTaskStatus: 'Sql审核状态',
    instanceName: '数据源',
    passRate: '审核通过率',
    taskScore: '审核结果评分',
  },

  status: {
    process: '处理中',
    exec_scheduled: '定时上线',
    executing: '正在上线',

    exec_failed: '上线失败',
    finished: '上线成功',
    wait_for_audit: '待审核',
    wait_for_execution: '待上线',
    reject: '已驳回',
    canceled: '已关闭',
    exec_succeeded: '上线成功',
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
    rejectFull: '全部驳回',
    rejectTips:
      '被驳回的工单必须修改审核语句，审核语句只能由工单创建者修改，在您修改了审核语句之后，工单即会从新进入审核流程',
    createOrder: '{{name}}创建了当前工单',
    updateOrder: '{{name}}更新了当前工单的SQL语句',
    wait: '正在等待用户{{username}}进行操作',
    notArrival: '等待上一步执行',
    approved: '{{username}}通过了当前工单的审核',
    executed: '{{username}}对当前工单进行了上线操作',
    rejectDetail: '{{name}}驳回了当前工单，驳回原因为',
    alreadyRejected: '工单已被驳回',
    alreadyClosed: '工单已被关闭',
    modifySql: '修改审核语句',
    waitModifySql: '等待用户{{username}}修改审核语句',
    sqlExecute: '立即上线',
    batchSqlExecute: '批量立即上线',
    batchSqlExecuteTips:
      '已经设置了定时上线的数据源仍然在定时时间上线，不会立即上线',
    sqlReview: '审核通过',
    unknown: '未知步骤',

    maintenanceTime:
      '定时上线的时间点必须在运维时间之内，当前数据源的运维时间为',
    sqlExecuteDisableTips:
      '只能在运维时间之内执行立即上线,当前数据源的运维时间为',
    emptyMaintenanceTime: '任意时间',

    approveSuccessTips: '审批通过',
    rejectSuccessTips: '驳回成功',
    rejectReason: '驳回原因',
    onlineRegularly: '定时上线',
    scheduleTime: '定时时间',
    execScheduledErrorMessage: '定时上线时间必须在运维时间之内',
    execScheduledBeforeNow: '定时上线时间必须在当前时间之后',
    cancelExecScheduled: '取消定时上线',
    cancelExecScheduledTip: '确定取消定时上线吗？',
    execScheduleTips: '定时上线设置成功',
    scheduleExec: '工单由{{username}}设置了{{time}}定时上线 ',
    executing: '工单由{{username}}立即上线',
    startTime: '上线开始时间：{{startTime}}',
    endTime: '上线结束时间：{{endTime}}',
    status: '上线状态',
    executingTips: '立即上线设置成功',
    disabledOperatorOrderBtnTips:
      '{{currentInstanceName}} 创建工单时最高只能允许有 {{allowAuditLevel}} 等级的审核错误。但是当前审核结果中最高包含 {{currentAuditLevel}} 等级的审核结果。',
  },

  create: {
    success: '工单创建成功',
    guide: '去工单列表查看刚刚创建的工单',
  },

  baseInfo: {
    title: '工单基本信息',

    name: '工单名称',
    describe: '工单描述',
  },

  sqlInfo: {
    title: '审核SQL语句信息',

    orderMode: '工单模式',
    orderModeTips: '当数据源类型相同时才能使用相同Sql模式',
    sameSql: '相同Sql',
    differenceSql: '不同Sql',

    instanceName: '数据源',
    instanceNameTips: '后续添加的数据源流程模板与当前数据源相同',
    instanceSchema: '数据库',
    sql: 'SQL语句',
    sqlFile: 'SQL文件',

    addInstance: '添加数据源',

    uploadType: '选择审核SQL语句上传方式',
    manualInput: '输入SQL语句',
    uploadFile: '上传SQL文件',
    updateMybatisFile: '上传Mybatis的XML文件',

    audit: '审核',
  },

  modifySql: {
    title: '修改工单SQL语句',
    submitTips: '提交之后您仍然有机会修改您的SQL语句',
    sqlFileTips: '您可以在审核结果处下载您之前上传的SQL文件',

    updateOrder: '使用下面的SQL语句更新当前工单',
    updateOrderConfirmTips:
      '您确认使用这份SQL更新当前工单么？确认之后，当前工单会立即进入审核流程',
    updateEmptyOrderTips: '不能使用审核结果为空的SQL更新当前工单',
    giveUpUpdate: '放弃本次修改',
    giveUpUpdateConfirmTips: '您确认放弃本次变更?',
  },

  workflowStatus: {
    review: '待审核',
    exec: '待上线',
  },
  batchCancel: {
    batchDelete: '批量关闭',
    cancelPopTitle: '您确认关闭所选工单吗？',
    messageWarn:
      '您所选的工单包含不可关闭的工单!（只有工单状态为“{{process}}”和“{{reject}}”的工单可以关闭。）',
  },

  auditResultCollection: {
    overview: '概览',
    table: {
      instanceName: '数据源',
      status: '状态',
      execStartTime: '上线开始时间',
      execEndTime: '上线结束时间',
      scheduleExecuteTime: '定时上线时间',
      assigneeUserName: '待操作人',
      executeUserName: '上线人',
      passRate: '审核通过率',
      score: '审核结果评分',
      operator: '操作',
      sqlExecute: '立即上线',
      scheduleTime: '定时上线',
      cancelExecScheduled: '取消定时上线',
      cancelExecScheduledTips: '取消定时上线成功',
    },
  },
};
