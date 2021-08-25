import {
  IGetRuleTemplateTipsResV1,
  IGetRuleTemplatesResV1,
  ICreateRuleTemplateReqV1,
  IBaseRes,
  IGetRuleTemplateResV1,
  IUpdateRuleTemplateReqV1,
  ICloneRuleTemplateReqV1,
  IGetRulesResV1
} from '../common.d';

export interface IGetRuleTemplateTipsV1Params {
  filter_db_type?: string;
}

export interface IGetRuleTemplateTipsV1Return
  extends IGetRuleTemplateTipsResV1 {}

export interface IGetRuleTemplateListV1Params {
  filter_instance_name?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetRuleTemplateListV1Return extends IGetRuleTemplatesResV1 {}

export interface ICreateRuleTemplateV1Params extends ICreateRuleTemplateReqV1 {}

export interface ICreateRuleTemplateV1Return extends IBaseRes {}

export interface IGetRuleTemplateV1Params {
  rule_template_name: string;
}

export interface IGetRuleTemplateV1Return extends IGetRuleTemplateResV1 {}

export interface IDeleteRuleTemplateV1Params {
  rule_template_name: string;
}

export interface IDeleteRuleTemplateV1Return extends IBaseRes {}

export interface IUpdateRuleTemplateV1Params extends IUpdateRuleTemplateReqV1 {
  rule_template_name: string;
}

export interface IUpdateRuleTemplateV1Return extends IBaseRes {}

export interface ICloneRuleTemplateV1Params extends ICloneRuleTemplateReqV1 {
  rule_template_name: string;
}

export interface ICloneRuleTemplateV1Return extends IBaseRes {}

export interface IGetRuleListV1Params {
  filter_db_type?: string;
}

export interface IGetRuleListV1Return extends IGetRulesResV1 {}
