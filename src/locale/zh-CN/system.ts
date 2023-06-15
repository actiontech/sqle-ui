// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '系统设置',
  pageDesc: '您可以在这里配置您的邮箱SMTP等系统配置',

  tabPaneTitle: {
    pushNotification: '消息推送',
    processConnection: '流程对接',
    loginConnection: '登录对接',
    globalConfiguration: '全局配置',
    license: '许可证',
    personalize: '个性化设置',
  },

  title: {
    dingTalk: '钉钉配置',
    smtp: 'SMTP',
    global: '全局配置',
    ldap: 'LDAP',
    license: 'License',
    wechat: '企业微信配置',
    oauth: 'Oauth2.0配置',
    lark: '飞书配置',
    personalize: '个性化设置',
    webhook: 'Webhook配置',
  },

  personalize: {
    title: '个性化标题',
    match: '新标题不能与旧标题一致',
    updateTitleSuccessTips: '个性化标题更新成功',

    logo: '个性化Logo',
    uploadAndUpdate: '上传并更新',
    uploadTips: '*建议尺寸为 58 × 48 的png图片',
    limitSize: '图片大小不能超过5MB',
  },

  lark: {
    enable: '是否启用飞书推送',
    test: '测试',
    testing: '正在向飞书推送消息...',
    testSuccess: '已成功将消息推送至指定账号',
    receiveType: '接收方式',
    email: '邮箱',
    phone: '手机号',
  },

  dingTalk: {
    titleTips: '审批信息将根据审核人的手机号发送到相应的钉钉账号',
    enable: '启用钉钉审批',
    test: '测试',
    testSuccess: '当前AppKey和AppSecret验证通过',
  },

  smtp: {
    enable: '启用邮件推送',
    host: 'SMTP地址',
    port: 'SMTP端口',
    username: 'SMTP用户名',
    password: 'SMTP密码',
    passwordConfirm: '确认SMTP密码',
    isSkipVerify: '是否跳过证书认证',
    skipVerifyTips: '跳过证书可能会遇到中间人攻击以及无法验证数据完整性等问题',

    test: '测试',
    receiver: '接收邮箱',

    testing: '正在向 “{{email}}” 发送测试邮件...',
    testSuccess: '已成功向 {{email}} 发送测试邮件。',
  },

  global: {
    orderExpiredHours: '已完成的工单自动过期时间',
    operationRecordExpiredHours: '操作记录过期时间',
    urlAddressPrefix: 'URL地址前缀',
    urlAddressPrefixTips: '配置能访问sqle的url地址信息',
    urlAddressFormatTips: '格式为 http(s)://ip:port',
  },

  ldap: {
    enableLdap: '是否启用LDAP服务',
    enableLdapSSL: '是否启用SSL',
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
    productName: 'SQL质量管理软件 V1.0',
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

  wechat: {
    enable_wechat_notify: '是否启用微信通知',
    corp_id: 'CorpID(微信企业号ID)',
    corp_secret: 'CorpSecret(CorpID对应密码)',
    agent_id: '企业微信应用ID',
    safe_enabled: '是否开启加密传输',
    proxy_ip: '代理服务器IP',

    test: '测试',
    receiveWechat: '接收者UserID',
    testing: '正在向{{id}}发送测试消息...',
    testSuccess: '测试消息发送成功',
  },

  webhook: {
    enableWebhookNotify: '是否开启Webhook通知',
    maxRetryTimes: '最大重试次数',
    retryIntervalSeconds: '最大重试间隔(秒)',
    test: '测试',
    testing: '正在向{{url}}推送测试信息...',
    testSuccess: '测试消息发送成功',
    configDocs: 'webhook配置文档',
  },

  oauth: {
    ceTips:
      'oauth登录为企业版功能。如果您要想使用这些功能，您可以按照以下链接中的商业支持里的联系方式进行咨询。',

    enable: '是否启用oauth登录',
    clientId: '应用 ID',
    clientIdTips:
      '应用的唯一标识, 从要对接的平台申请 , 在OAuth2.0认证过程中，appid的值即为oauth_consumer_key的值。',

    clientSecret: '应用密钥',
    clientSecretTips:
      'appid对应的密钥，访问用户资源时用来验证应用的合法性。在OAuth2.0认证过程中，appkey的值即为oauth_consumer_secret的值。如果之前配置过该项，更新时不填写该项代表不更新密钥。',
    clientHost: '外部访问sqle的地址',
    clientHostTips: '格式为 http(s)://ip:port',

    serverAuthUrl: 'oauth2登录授权页面地址',
    serverAuthUrlTips: '格式类似于 http(s)://ip:port/xxx',

    serverTokenUrl: 'oauth2 access_token 获取地址',
    serverTokenUrlTips: '格式类似于 http(s)://ip:port/xxx',

    serverUserIdUrl: 'oauth2 user id 获取地址',
    serverUserIdUrlTips: '格式类似于 http(s)://ip:port/xxx',

    scopes: '请求资源范围',
    scopesTips: '	此范围由验证服务器定义,多个范围用逗号分隔',

    accessTokenKeyName: 'access_token Key名称',
    accessTokenKeyNameTips:
      'sqle会在获取用户ID时将access_token放在这个key对应的value中, 此参数会作为get请求的参数发送给用户ID获取地址',

    userIdKeyName: 'user_id Key名称',
    userIdKeyNameTips:
      'sqle会尝试使用此key从第三方平台的响应中解析出用户ID,用户ID应当为唯一ID',

    loginButtonText: '登录按钮文字',
    loginButtonTextTips: 'login页面oauth登录按钮文字',
  },
};
