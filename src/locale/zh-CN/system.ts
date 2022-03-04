// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '系统设置',
  pageDesc: '您可以在这里配置您的邮箱SMTP等系统配置',

  title: {
    smtp: 'SMTP',
    global: '全局配置',
    ldap: 'LDAP',
    license: 'License',
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

  log: {
    version: '查看版本号',
    version_title: 'SQLE 概述',
    sqle_desc:
      'SQLE 是由上海爱可生信息技术股份有限公司 开发并开源，支持SQL审核、索引优化、事前审核、事后审核、支持标准化上线流程、原生支持 MySQL 审核且数据库类型可扩展的 SQL 审核工具。',
    sqle_feature: `功能特点: 
         1. 支持通过插件的形式扩展可审核上线的数据库类型，无需升级软件，导入审核插件即可获对应数据库类型的审核上线能力，使用平台所有功能；
         2. 支持标准的 HTTP API，可与其他内部流程系统对接；
         3. 支持 DDL，和 DML 同时审核，并实现同工单内语句上下文关联；
         4. 支持在审核规则外对语句做必要的对象验证，防止实际执行时库表不存在等情况。
      `,
  },

  license: {
    table: {
      name: '名称',
      limit: '限制',
    },

    form: {
      licenseFile: 'License文件',
    },

    collect: '收集许可信息',
    import: '导入许可信息',
    importSuccessTips: '导入License成功',
  },
};
