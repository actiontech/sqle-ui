// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '审核规则模版',
  pageDescribe: 'SQL审核会应用数据源绑定的规则模板',

  ruleTemplateListTitle: '项目规则模版列表',
  globalRuleTemplateListTitle: '公共规则模板列表',

  backToList: '返回审核规则模版列表',

  ruleTemplateList: {
    descEmpty: '无',

    instance: '应用的数据库',
    instanceEmpty: '未绑定任何数据库',

    table: {
      templateName: '模版名称',
      desc: '描述',
      dbType: '可应用的数据库类型',
      dataSource: '绑定的数据源',
    },
  },

  deleteRuleTemplate: {
    tips: '确认要删除规则模版"{{name}}"么?',
    deleting: '正在删除模版 "{{name}}"...',
    deleteSuccessTips: '删除模版"{{name}}"成功',
  },

  ruleTemplateForm: {
    baseInfoTitle: '基本信息',
    baseInfoDesc: '设定模版的名称、描述等基本信息',

    ruleTitle: '规则',
    ruleDesc: '选择要启用的规则',

    result: '结果',
    resultDesc: '变更结果',

    templateName: '模版名称',
    templateDesc: '模版描述',
    databaseType: '数据库类型',

    activeRuleTitle: '已启用规则',
    activeRule: '启用该规则',
    activeAllRules: '启用所有规则',
    disableRuleTitle: '已禁用规则',
    disableAllRules: '禁用全部规则',
    disableRule: '禁用该规则',
    editRule: '编辑该规则',

    emptyRule: '没有找到对应规则',
    ruleValue: '规则值',
  },

  createRuleTemplate: {
    button: '创建规则模版',
    title: '创建审核规则模版',
    successTitle: '创建审核规则模版成功',
    createNew: '再创建一个新的审核规则模版 >',
  },

  importRuleTemplate: {
    button: '导入规则模板',
    title: '导入审核规则模板',
    selectFile: '请选择导入文件',
    submitText: '导入',
    fileRequireTips: '当前未选择任何文件',
    successTitle: '导入审核规则模版成功',
    importNew: '再导入一个新的审核规则模版 >',
    importingFile: '正在导入文件...',
  },

  exportRuleTemplate: {
    button: '导出规则模板',
    exporting: '正在导出模版 "{{name}}"...',
    exportSuccessTips: '导出模版"{{name}}"成功',
  },

  updateRuleTemplate: {
    title: '更新审核规则模版',
    successTitle: '更新审核规则模版 ({{name}}) 成功',
  },

  editModal: {
    title: '编辑规则',
    ruleLevelLabel: '规则等级',
    ruleLevelValue: '预设值',
    ruleLevelLabelPlace: '请选择规则对应的等级',

    ruleLevelValuePlace: '请填写规则的默认值',
    ruleDescLabel: '规则描述',
    ruleTypeLabel: '规则分类',
    ruleNameLabel: '规则名称',
    ruleDbType: '数据库类型',
    rule: '规则',
    annotation: '说明',
    ruleValueTypeOnlyNumber: '当前规则值类型只能为数字',
  },

  cloneRuleTemplate: {
    button: '克隆规则模版',
    title: '克隆规则模版',
    cloneDesc:
      '克隆的规则模版只会继承源模版所有启用的规则、以及变更过的规则等级和阈值。克隆出的新规则模版的模版名称等基本信息需要手动填写。',
    currentTemplateTips: '正在克隆审核规则模版',
    successTips: '克隆规则模版 "{{name}}" 成功',
  },

  ruleLevel: {
    normal: '普通',
    error: '错误',
    warn: '告警',
    notice: '提示',
    unknown: '未知',
  },
};
