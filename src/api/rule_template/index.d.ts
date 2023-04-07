import {
  IGetRuleTemplateTipsResV1,
  IGetProjectRuleTemplatesResV1,
  ICreateProjectRuleTemplateReqV1,
  IBaseRes,
  IGetProjectRuleTemplateResV1,
  IUpdateProjectRuleTemplateReqV1,
  ICloneProjectRuleTemplateReqV1,
  IGetRuleTemplatesResV1,
  ICreateRuleTemplateReqV1,
  IParseProjectRuleTemplateFileResV1,
  IGetRuleTemplateResV1,
  IUpdateRuleTemplateReqV1,
  ICloneRuleTemplateReqV1,
  IGetRulesResV1
} from '../common.d';

export interface IGetProjectRuleTemplateTipsV1Params {
  project_name: string;

  filter_db_type?: string;
}

export interface IGetProjectRuleTemplateTipsV1Return
  extends IGetRuleTemplateTipsResV1 {}

export interface IGetProjectRuleTemplateListV1Params {
  project_name: string;

  page_index: number;

  page_size: number;
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

  rule_template_name: string;
}

export interface IGetProjectRuleTemplateV1Return
  extends IGetProjectRuleTemplateResV1 {}

export interface IDeleteProjectRuleTemplateV1Params {
  project_name: string;

  rule_template_name: string;
}

export interface IDeleteProjectRuleTemplateV1Return extends IBaseRes {}

export interface IUpdateProjectRuleTemplateV1Params
  extends IUpdateProjectRuleTemplateReqV1 {
  project_name: string;

  rule_template_name: string;
}

export interface IUpdateProjectRuleTemplateV1Return extends IBaseRes {}

export interface ICloneProjectRuleTemplateV1Params
  extends ICloneProjectRuleTemplateReqV1 {
  project_name: string;

  rule_template_name: string;
}

export interface ICloneProjectRuleTemplateV1Return extends IBaseRes {}

export interface IExportProjectRuleTemplateV1Params {
  project_name: string;

  rule_template_name: string;
}

export interface IGetRuleTemplateTipsV1Params {
  filter_db_type?: string;
}

export interface IGetRuleTemplateTipsV1Return
  extends IGetRuleTemplateTipsResV1 {}

export interface IGetRuleTemplateListV1Params {
  page_index: number;

  page_size: number;
}

export interface IGetRuleTemplateListV1Return extends IGetRuleTemplatesResV1 {}

export interface ICreateRuleTemplateV1Params extends ICreateRuleTemplateReqV1 {}

export interface ICreateRuleTemplateV1Return extends IBaseRes {}

export interface IImportProjectRuleTemplateV1Params {
  rule_template_file: any;
}

export interface IImportProjectRuleTemplateV1Return
  extends IParseProjectRuleTemplateFileResV1 {}

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

export interface IExportRuleTemplateV1Params {
  rule_template_name: string;
}

export interface IGetRuleListV1Params {
  filter_db_type?: string;

  filter_global_rule_template_name?: string;

  filter_rule_names?: string;
}

export interface IGetRuleListV1Return extends IGetRulesResV1 {}
