// eslint-disable-next-line import/no-anonymous-default-export
export default {
  username: '用户名',
  password: '密码',

  unknownError: '未知错误...',
  unknownStatus: '未知状态...',

  ok: '确认',
  cancel: '取消',
  submit: '提交',
  close: '关闭',
  edit: '编辑',
  modify: '修改',
  delete: '删除',
  reset: '重置',
  resetAll: '重置所有内容',
  search: '搜索',
  retry: '重试',
  back: '返回',
  more: '更多',
  upload: '选择文件上传',
  resetAndClose: '重置表单并关闭',
  operateSuccess: '操作成功',
  operate: '操作',

  prevStep: '上一步',
  nextStep: '下一步',

  expansion: '展开',
  collapse: '收起',

  showAll: '查看所有',
  showDetail: '查看详情',

  in: '在',
  on: '的',
  and: '且',
  at: '中',
  preview: '预览',

  theme: {
    light: '明亮模式',
    dark: '暗黑模式',
  },

  logout: '退出登录',
  account: '个人中心',

  nav: {
    title: 'SQLE',
  },

  request: {
    noticeFailTitle: '请求错误',
  },

  time: {
    hour: '小时',
    year: '年',
    month: '月',
    day: '天',
    no: '日',
    week: '星期',
    minute: '分钟',
    per: '每',
  },

  form: {
    placeholder: {
      input: '请输入{{name}}',
      select: '请选择{{name}}',
      searchInput: '请输入要搜索的 {{name}}',
      searchSelect: '请选择要搜索的 {{name}}',
    },
    rule: {
      require: '必须填写{{name}}',
      selectFile: '必须选择一个文件',
      passwordNotMatch: '两次密码输入不一致',
      email: '请输入有效的邮箱地址',
      startWithLetter: '必须要以字母开头',
      onlyLetterAndNumber: '只能包含字母、数字、中划线和下划线',
    },
  },

  cron: {
    mode: {
      select: '可视化选择',
      manual: '手工填写',
    },
    errorMessage: {
      invalid: '无效的cron表达式',
      mustBeString: 'cron表达式必须是一个字符串',
      mustBeArray: '变更的值必须是一个数组',
      lenMustBeFive: 'cron表达式必须只包含（分钟 小时 日期 月份 星期）5个元素',
      onlyHaveValidChar: 'cron表达式只能包含数字中划线(-),斜线(/),和逗号(,)',
      limit:
        '您的表达式中包含不合法的数值范围， minute(0-59), hour(0-23), day(1,31), month(1-12), week(0-6)',
    },
  },
};
