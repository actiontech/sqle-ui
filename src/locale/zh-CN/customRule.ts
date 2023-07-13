/* eslint-disable import/no-anonymous-default-export */
export default {
  title: '自定义规则',
  ceTips:
    '当用户基于业务需求，需要新建审核规则时，可以使用平台的自定义规则功能，通过平台快速开发，降低用户规则开发门槛',

  filterForm: {
    databaseType: '数据源类型',
    ruleName: '规则名称',
    add: '新建',
  },

  editRule: '编辑该规则',
  deleteRule: '删除该规则',
  deleteSuccessTips: '规则 {{desc}} 删除成功',
  deleteConfirm: '是否确认删除该规则？',

  addCustomRule: {
    title: '创建自定义审核规则',
    successTitle: '提交成功',
    backToList: '查看创建的自定义规则',
  },

  editCustomRule: {
    title: '编辑自定义审核规则',
    successTitle: '提交成功',
    backToList: '查看创建的自定义规则',
  },

  customRuleForm: {
    baseInfoTitle: '基本信息',
    baseInfoDesc: '填写规则基本信息',

    editRuleTitle: '编写规则',
    editRuleDesc: '编写规则脚本',

    submit: '提交',
    submitCustomRule: '提交自定义规则',
  },

  baseInfoForm: {
    ruleID: '规则ID',
    ruleName: '规则名称',
    ruleDesc: '规则说明',
    dbType: '适用数据源类型',
    ruleType: '规则分类',
    level: '默认告警等级',
    addExtraRuleType: '新增规则分类',
    addExtraRuleTypePlaceholder: '请输入需要新增的规则分类名称',
  },

  editScriptForm: {
    inputRuleScript: '规则脚本',
    placeholder: '请在此处输入正则表达式',
  },
};
