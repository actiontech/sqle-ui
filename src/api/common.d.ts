export interface IBaseRes {
  code?: number;

  message?: string;
}

export interface ICreateRoleReqV1 {
  instance_name_list?: string[];

  role_desc?: string;

  role_name?: string;

  user_name_list?: string[];
}

export interface ICreateUserReqV1 {
  email?: string;

  role_name_list?: string[];

  user_name?: string;

  user_password?: string;
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

export interface IRoleResV1 {
  instance_name_list?: string[];

  role_desc?: string;

  role_name?: string;

  user_name_list?: string[];
}

export interface IRoleTipResV1 {
  role_name?: string;
}

export interface IUpdateRoleReqV1 {
  instance_name_list?: string[];

  role_desc?: string;

  user_name_list?: string[];
}

export interface IUpdateUserReqV1 {
  email?: string;

  role_name_list?: string[];
}

export interface IUserLoginReqV1 {
  password?: string;

  username?: string;
}

export interface IUserLoginResV1 {
  is_admin?: boolean;

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
