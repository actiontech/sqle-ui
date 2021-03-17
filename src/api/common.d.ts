export interface IBaseRes {
  code?: number;

  message?: string;
}

export interface ICreateInstanceReqV1 {
  db_host?: string;

  db_password?: string;

  db_port?: string;

  db_user?: string;

  desc?: string;

  instance_name?: string;

  role_name_list?: string[];

  rule_template_name_list?: string[];

  workflow_template_name?: string;
}

export interface ICreateRoleReqV1 {
  instance_name_list?: string[];

  role_desc?: string;

  role_name?: string;

  user_name_list?: string[];
}

export interface ICreateRuleTemplateReqV1 {
  desc?: string;

  instance_name_list?: string[];

  rule_name_list?: string[];

  rule_template_name?: string;
}

export interface ICreateUserReqV1 {
  email?: string;

  role_name_list?: string[];

  user_name?: string;

  user_password?: string;
}

export interface IGetInstanceConnectableReqV1 {
  host?: string;

  password?: string;

  port?: string;

  user?: string;
}

export interface IGetInstanceConnectableResV1 {
  code?: number;

  data?: IInstanceConnectableResV1;

  message?: string;
}

export interface IGetInstanceResV1 {
  code?: number;

  data?: IInstanceResV1;

  message?: string;
}

export interface IGetInstanceSchemaResV1 {
  code?: number;

  data?: IInstanceSchemaResV1;

  message?: string;
}

export interface IGetInstanceTipsResV1 {
  code?: number;

  data?: IInstanceTipResV1[];

  message?: string;
}

export interface IGetInstancesResV1 {
  code?: number;

  data?: IInstanceResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetRoleTipsResV1 {
  code?: number;

  data?: IRoleTipResV1[];

  message?: string;
}

export interface IGetRolesResV1 {
  code?: number;

  data?: IRoleResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetRuleTemplateResV1 {
  code?: number;

  data?: IRuleTemplateDetailResV1;

  message?: string;
}

export interface IGetRuleTemplateTipsResV1 {
  code?: number;

  data?: IRuleTemplateTipResV1[];

  message?: string;
}

export interface IGetRuleTemplatesResV1 {
  code?: number;

  data?: IRuleTemplateDetailResV1[];

  message?: string;

  total_nums?: number;
}

export interface IGetRulesResV1 {
  code?: number;

  data?: IRuleResV1[];

  message?: string;
}

export interface IGetUserDetailResV1 {
  code?: number;

  data?: IUserDetailResV1;

  message?: string;
}

export interface IGetUserLoginResV1 {
  code?: number;

  data?: IUserLoginResV1;

  message?: string;
}

export interface IGetUserTipsResV1 {
  code?: number;

  data?: IUserTipResV1[];

  message?: string;
}

export interface IGetUsersResV1 {
  code?: number;

  data?: IUserResV1[];

  message?: string;

  total_nums?: number;
}

export interface IInstanceConnectableResV1 {
  is_instance_connectable?: boolean;
}

export interface IInstanceResV1 {
  db_host?: string;

  db_port?: string;

  db_user?: string;

  desc?: string;

  instance_name?: string;

  role_name_list?: string[];

  rule_template_name_list?: string[];

  workflow_template_name?: string;
}

export interface IInstanceSchemaResV1 {
  schema_name_list?: string[];
}

export interface IInstanceTipResV1 {
  instance_name?: string;
}

export interface IRoleResV1 {
  instance_name_list?: string[];

  role_desc?: string;

  role_name?: string;

  user_name_list?: string[];
}

export interface IRoleTipResV1 {
  role_name?: string;
}

export interface IRuleResV1 {
  desc?: string;

  level?: string;

  rule_name?: string;

  value?: string;
}

export interface IRuleTemplateDetailResV1 {
  desc?: string;

  instance_name_list?: string[];

  rule_name_list?: string[];

  rule_template_name?: string;
}

export interface IRuleTemplateTipResV1 {
  rule_template_name?: string;
}

export interface IUpdateInstanceReqV1 {
  db_host?: string;

  db_password?: string;

  db_port?: string;

  db_user?: string;

  desc?: string;

  role_name_list?: string[];

  rule_template_name_list?: string[];

  workflow_template_name?: string;
}

export interface IUpdateRoleReqV1 {
  instance_name_list?: string[];

  role_desc?: string;

  user_name_list?: string[];
}

export interface IUpdateRuleTemplateReqV1 {
  desc?: string;

  instance_name_list?: string[];

  rule_name_list?: string[];
}

export interface IUpdateUserReqV1 {
  email?: string;

  role_name_list?: string[];
}

export interface IUserDetailResV1 {
  email?: string;

  is_admin?: boolean;

  role_name_list?: string[];

  user_name?: string;
}

export interface IUserLoginReqV1 {
  password?: string;

  username?: string;
}

export interface IUserLoginResV1 {
  token?: string;
}

export interface IUserResV1 {
  email?: string;

  role_name_list?: string[];

  user_name?: string;
}

export interface IUserTipResV1 {
  user_name?: string;
}
