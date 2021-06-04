// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '系统设置',
  pageDesc: '您可以在这里配置您的邮箱SMTP等系统配置',

  title: {
    smtp: 'SMTP',
    global: '全局配置',
  },

  smtp: {
    host: 'SMTP地址',
    port: 'SMTP端口',
    username: 'SMTP用户名',
    password: 'SMTP密码',
    passwordConfirm: '确认SMTP密码',
  },

  global: {
    orderExpiredHours: '已完成的工单回收周期',
  },
};
