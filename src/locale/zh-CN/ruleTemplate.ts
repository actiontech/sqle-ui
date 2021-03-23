// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '审核规则模版',
  pageDescribe: '数据库会应用其所绑定的所有规则模版的规则并集进行SQL审核',

  ruleTemplateListTitle: '规则模版列表',

  backToList: '返回审核规则模版列表',

  ruleTemplateList: {
    descEmpty: '无',

    instance: '应用的数据库',
    instanceEmpty: '未绑定任何数据库',
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
    instances: '应用的数据库',

    activeRuleTitle: '已启用规则',
    activeRule: '启用该规则',
    activeAllRules: '启用所有规则',
    disableRuleTitle: '已禁用规则',
    disableAllRules: '禁用全部规则',
    disableRule: '禁用该规则',

    emptyRule: '没有找到对应规则',
    ruleValue: '规则值',
  },

  createRuleTemplate: {
    button: '创建规则模版',
    title: '创建审核规则模版',
    successTitle: '创建审核规则模版成功',
    createNew: '再创建一个新的审核规则模版 >',
  },

  updateRuleTemplate: {
    title: '更新审核规则模版',
    successTitle: '更新审核规则模版成功',
  },
};
