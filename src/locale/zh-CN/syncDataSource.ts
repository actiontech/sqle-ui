/* eslint-disable import/no-anonymous-default-export */
export default {
  pageTitle: '外部数据源同步',
  pageDesc:
    '您可以在这里添加外部数据源管理平台配置, SQLE 会定期从外部平台将数据源同步过来。',
  ceTips:
    '当用户在其他平台上添加了数据源后，如果想要对这些数据源进行 SQL 质量监控，可以使用 SQLE 平台的外部数据源同步功能，将外部平台的数据源同步至 SQLE。\n由此可避免在两个平台上重复添加数据源，降低管理难度。',
  syncTaskList: {
    title: '同步任务列表',
    addSyncTask: '添加同步任务',
    syncTaskLoading: '正在同步任务...',
    syncTaskSuccessTips: '同步任务成功',
    deleteTaskLoading: '正在删除任务...',
    deleteTaskSuccessTips: '删除任务成功',
    columns: {
      source: '来源',
      version: '版本',
      url: '地址',
      instanceType: '数据源类型',
      lastSyncResult: '最后一次同步结果',
      lastSyncSuccessTime: '最近一次同步成功时间',
      sync: '同步',
      deleteConfirmTitle: '确定要删除当前同步任务?',
    },
  },

  addSyncTask: {
    title: '添加同步任务',
    successTips: '添加同步任务成功',
    successGuide: '到同步任务列表查看看看添加的同步任务',
  },
  updateSyncTask: {
    title: '编辑同步任务',
    successTips: '同步任务编辑成功',
    getSyncInstanceTaskError: '获取同步任务数据失败',
  },
  syncTaskForm: {
    source: '来源',
    version: '版本',
    url: '地址',
    instanceType: '数据源类型',
    ruleTemplateName: '审核规则模板',
    syncInterval: '同步间隔',
  },
};
