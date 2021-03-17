import {
  IGetRoleTipsResV1,
  IGetRolesResV1,
  ICreateRoleReqV1,
  IBaseRes,
  IUpdateRoleReqV1
} from '../common.d';

export interface IGetRoleTipListV1Return extends IGetRoleTipsResV1 {}

export interface IGetRoleListV1Params {
  filter_role_name?: string;

  filter_user_name?: string;

  filter_instance_name?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetRoleListV1Return extends IGetRolesResV1 {}

export interface ICreateRoleV1Params extends ICreateRoleReqV1 {}

export interface ICreateRoleV1Return extends IBaseRes {}

export interface IDeleteRoleV1Params {
  role_name: string;
}

export interface IDeleteRoleV1Return extends IBaseRes {}

export interface IUpdateRoleV1Params extends IUpdateRoleReqV1 {
  role_name: string;
}

export interface IUpdateRoleV1Return extends IBaseRes {}
