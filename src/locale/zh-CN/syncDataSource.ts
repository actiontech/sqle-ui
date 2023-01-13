/* eslint-disable import/no-anonymous-default-export */
export default {
  pageTitle: '外部数据源同步',
  pageDesc: '您可以在这里添加外部数据源管理平台配置, SQLE 会定期从外部平台将数据源同步过来。',
  ceTips: '外部数据源同步为企业版功能。如果您要想使用这些功能，您可以按照以下链接中的商业支持里的联系方式进行咨询。',
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
      deleteConfirmTitle: '确定要删除当前同步任务?'
    }
  },

  addSyncTask: {
    title: '添加同步任务',
    successTips: '添加同步任务成功',
    successGuide: '到同步任务列表查看看看添加的同步任务'
  },
  updateSyncTask: {
    title: '编辑同步任务',
    successTips: '同步任务编辑成功',
    getSyncInstanceTaskError: '获取同步任务数据失败'
  },
  syncTaskForm: {
    source: '来源',
    version: '版本',
    url: '地址',
    instanceType: '数据源类型',
    ruleTemplateName: '审核规则模板',
    syncInterval: '同步间隔'
  }
}