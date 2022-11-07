import {
  IGetProjectRuleTemplatesResV1,
  ICreateProjectRuleTemplateReqV1,
  IBaseRes,
  IGetProjectRuleTemplateResV1,
  IUpdateProjectRuleTemplateReqV1,
  ICloneProjectRuleTemplateReqV1,
  IGetRuleTemplateTipsResV1,
  IGetRuleTemplatesResV1,
  ICreateRuleTemplateReqV1,
  IGetRuleTemplateResV1,
  IUpdateRuleTemplateReqV1,
  ICloneRuleTemplateReqV1,
  IGetRulesResV1
} from '../common.d';

export interface IGetProjectRuleTemplateListV1Params {
  project_name: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetProjectRuleTemplateListV1Return
  extends IGetProjectRuleTemplatesResV1 {}

export interface ICreateProjectRuleTemplateV1Params
  extends ICreateProjectRuleTemplateReqV1 {
  project_name: string;
}

export interface ICreateProjectRuleTemplateV1Return extends IBaseRes {}

export interface IGetProjectRuleTemplateV1Params {
  project_name: string;

  rule_template_id: number;
}

export interface IGetProjectRuleTemplateV1Return
  extends IGetProjectRuleTemplateResV1 {}

export interface IDeleteProjectRuleTemplateV1Params {
  project_name: string;

  rule_template_id: number;
}

export interface IDeleteProjectRuleTemplateV1Return extends IBaseRes {}

export interface IUpdateProjectRuleTemplateV1Params
  extends IUpdateProjectRuleTemplateReqV1 {
  project_name: string;

  rule_template_id: number;
}

export interface IUpdateProjectRuleTemplateV1Return extends IBaseRes {}

export interface ICloneProjectRuleTemplateV1Params
  extends ICloneProjectRuleTemplateReqV1 {
  project_name: string;

  rule_template_id: number;
}

export interface ICloneProjectRuleTemplateV1Return extends IBaseRes {}

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
  rule_template_id: number;
}

export interface IGetRuleTemplateV1Return extends IGetRuleTemplateResV1 {}

export interface IDeleteRuleTemplateV1Params {
  rule_template_id: number;
}

export interface IDeleteRuleTemplateV1Return extends IBaseRes {}

export interface IUpdateRuleTemplateV1Params extends IUpdateRuleTemplateReqV1 {
  rule_template_id: number;
}

export interface IUpdateRuleTemplateV1Return extends IBaseRes {}

export interface ICloneRuleTemplateV1Params extends ICloneRuleTemplateReqV1 {
  rule_template_id: number;
}

export interface ICloneRuleTemplateV1Return extends IBaseRes {}

export interface IGetRuleListV1Params {
  filter_db_type?: string;
}

export interface IGetRuleListV1Return extends IGetRulesResV1 {}
