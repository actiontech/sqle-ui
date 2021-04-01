// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '工单创建',
  pageDesc: '您可以在这里选择数据源进行创建SQL审核工单',

  createOrder: '创建工单',

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
};
