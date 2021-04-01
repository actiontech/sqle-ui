// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '工单详情',
  order: {
    name: '工单名称',
    createUser: '创建人',
    createTime: '创建时间',
    desc: '工单描述',
  },

  status: {
    canceled: '已关闭',
    finished: '已上线',
    process: '待审核',
    reject: '已驳回',
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
  },
};
