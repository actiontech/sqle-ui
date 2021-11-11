// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '系统设置',
  pageDesc: '您可以在这里配置您的邮箱SMTP等系统配置',

  title: {
    smtp: 'SMTP',
    global: '全局配置',
    ldap: 'LDAP',
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

  ldap: {
    enableLadp: '是否启用LDAP服务',
    ldapServerHost: 'LDAP服务器地址',
    ldapServerPort: 'LDAP服务器端口',
    ldapConnectDn: '连接用户DN',
    ldapConnectDnTips: '通过此用户登录ldap查询login界面登录用户的信息',
    ldapConnectPwd: '连接用户密码',
    ldapSearchBaseDn: '查询根DN',
    ldapSearchBaseDnTips: '查询根DN, 描述: 查询时会以此目录作为根目录进行查询',
    ldapUserNameRdnKey: '用户名属性名',
    ldapUserNameRdnKeyTips: 'SQLE绑定的用户名在LDAP中对应的属性名',
    ldapUserEmailRdnKey: '用户邮箱属性名',
    ldapUserEmailRdnKeyTips: 'SQLE绑定的用户邮箱在LDAP中对应的属性名',
  },
};
