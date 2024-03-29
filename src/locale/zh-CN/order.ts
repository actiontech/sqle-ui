// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '工单详情',
  orderList: {
    pageTitle: '工单列表',
    pageDesc: '工单列表中只会展示与您相关的工单。',

    allOrderAboutMe: '所有与我相关的工单',
  },
  createOrder: {
    button: '创建工单',
    title: '创建工单',
    pageDesc: '您可以在这里选择数据源进行创建SQL审核工单',
    dirtyDataTips:
      '检测到您在审核SQL语句之后,又修改了‘审核SQL语句信息’表单中的内容并且没有再点击审核，现在会使用当前审核结果表格中的SQL语句进行创建工单，您确认这样做么？',
    unsupportMybatisTips: '暂时不支持创建SQL语句类型为Mybatis的工单',
    mustAuditTips: '您必须先对您的SQL进行审核才能进行创建工单',
    mustHaveAuditResultTips: '不能对审核结果为空的SQL进行创建工单',
    inDifferenceSqlModeShouldAuditAllInstance:
      '在不同sql语句模式下, 需审核所有数据源后才能创建工单!',
    workflowNameRule: '只能包含字母、数字、中文、中划线和下划线',
  },
  closeOrder: {
    button: '关闭工单',
    closeConfirm: '您确认关闭当前工单？',
    closeOrderSuccessTips: '工单关闭成功',
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
    id: '工单号',
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
    manually_executed: '人工上线',
    terminate_failed: '中止失败',
    terminate_succeeded: '中止成功',
    terminating: '正在中止',
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
    markManually: '标记为人工上线',
    markManuallyConfirmTips:
      '当前操作仅修改工单状态，而不对数据源产生操作，是否确认标记为人工上线?',
    rejectTips:
      '当工单被驳回时，工单创建者需要对其进行修改，然后重新提交审核。',
    wait: '正在等待用户{{username}}进行操作',
    notArrival: '等待上一步执行',
    rejectDetail: '{{name}}驳回了当前工单，驳回原因为',
    alreadyRejected: '工单已被驳回',
    alreadyClosed: '工单已被关闭',
    modifySql: '修改审核语句',
    waitModifySql: '等待用户{{username}}修改审核语句',
    batchSqlExecute: '批量立即上线',
    batchSqlExecuteConfirmTips:
      '当前操作将立即执行工单下的所有SQL语句，且已经设置了定时上线的数据源仍然在定时时间上线，不会立即上线，是否确认立即批量上线?',
    sqlReview: '审核通过',
    terminate: '中止上线',
    terminateSuccessTips: '中止上线成功',
    terminateConfirmTips:
      '此操作将中断当前上线操作, 并回滚当前正在执行的SQL, 是否确认中止上线?',
    unknown: '未知步骤',

    maintenanceTime:
      '定时上线的时间点必须在运维时间之内，当前数据源的运维时间为',
    sqlExecuteDisableTips:
      '只能在运维时间之内执行立即上线，当前数据源的运维时间为',
    emptyMaintenanceTime: '任意时间',

    approveSuccessTips: '审批通过',
    rejectSuccessTips: '驳回成功',
    completeSuccessTips: '同步工单已上线成功',
    rejectReason: '驳回原因',
    rejectAllTips: '当前操作将驳回工单下所有SQL语句，是否确认全部驳回?',
    onlineRegularly: '定时上线',
    scheduleTime: '定时时间',
    execScheduledErrorMessage: '定时上线时间必须在运维时间之内',
    execScheduledBeforeNow: '定时上线时间必须在当前时间之后',
    execScheduleTips: '定时上线设置成功',
    status: '上线状态',
    executingTips: '立即上线设置成功',
    disabledOperatorOrderBtnTips:
      '项目 {{currentProject}} 创建工单时最高只能允许有 {{allowAuditLevel}} 等级的审核错误，但是当前审核结果中最高包含 {{currentAuditLevel}} 等级的审核结果。',
    createOrderStep: '创建工单',
    updateOrderStep: '更新工单',
    reviewOrderStep: '审核工单',
    executeOrderStep: '上线工单',
    stepNumberIsUndefined: '当前节点的步骤数未定义!',
  },

  create: {
    success: '工单创建成功',
    guide: '查看工单详情',
    cloneOrder: '克隆工单',
  },

  baseInfo: {
    title: '工单基本信息',

    name: '工单名称',
    describe: '工单描述',
  },

  sqlInfo: {
    title: '审核SQL语句信息',

    isSameSqlOrder: '是否选择相同SQL',
    orderModeTips: '当数据源类型相同时才能使用相同Sql模式',

    instanceName: '数据源',
    instanceNameTips: '后续添加的数据源流程模板与当前数据源相同',
    instanceSchema: '数据库',
    sql: 'SQL语句',
    sqlFile: 'SQL文件',
    mybatisFile: 'Mybatis的XML文件',
    zipFile: 'ZIP文件',

    addInstance: '添加数据源',

    uploadType: '选择审核SQL语句上传方式',
    manualInput: '输入SQL语句',
    uploadFile: '上传SQL文件',
    uploadMybatisFile: '上传Mybatis的XML文件',
    uploadZipFile: '上传ZIP文件',

    audit: '审核',
    format: 'SQL美化',
    formatTips:
      '目前，支持 SQL 美化的数据库类型有 {{supportType}}。如果未选择数据源或选择的数据源类型尚未得到支持，进行 SQL 美化可能会导致 SQL 语句语法错误。',
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

  exportOrder: {
    buttonText: '导出工单',
    exporting: '正在导出历史工单',
    exportSuccessTips: '历史工单导出成功',
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
      sqlExecuteConfirmTips:
        '当前操作将立即执行该数据源上的sql语句, 是否确认立即上线',
    },
  },
};
