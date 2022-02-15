import {
  IGetUserGroupTipsResV1,
  IGetUserGroupsResV1,
  ICreateUserGroupReqV1,
  IBaseRes,
  IPatchUserGroupReqV1
} from '../common.d';

export interface IGetUserGroupTipListV1Return extends IGetUserGroupTipsResV1 {}

export interface IGetUserGroupListV1Params {
  filter_user_group_name?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetUserGroupListV1Return extends IGetUserGroupsResV1 {}

export interface ICreateUserGroupV1Params extends ICreateUserGroupReqV1 {}

export interface ICreateUserGroupV1Return extends IBaseRes {}

export interface IDeleteUserGroupV1Params {
  user_group_name: string;
}

export interface IDeleteUserGroupV1Return extends IBaseRes {}

export interface IUpdateUserGroupV1Params extends IPatchUserGroupReqV1 {
  user_group_name: string;
}

export interface IUpdateUserGroupV1Return extends IBaseRes {}
