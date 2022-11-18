import {
  IGetMemberGroupsRespV1,
  ICreateMemberGroupReqV1,
  IBaseRes,
  IGetMemberGroupRespV1,
  IUpdateMemberGroupReqV1,
  IGetUserGroupTipsResV1,
  IGetUserGroupsResV1,
  ICreateUserGroupReqV1,
  IPatchUserGroupReqV1
} from '../common.d';

export interface IGetMemberGroupsV1Params {
  filter_user_group_name?: string;

  filter_instance_name?: string;

  page_index?: number;

  page_size?: number;

  project_name: string;
}

export interface IGetMemberGroupsV1Return extends IGetMemberGroupsRespV1 {}

export interface IAddMemberGroupV1Params extends ICreateMemberGroupReqV1 {
  project_name: string;
}

export interface IAddMemberGroupV1Return extends IBaseRes {}

export interface IGetMemberGroupV1Params {
  project_name: string;

  user_group_name: string;
}

export interface IGetMemberGroupV1Return extends IGetMemberGroupRespV1 {}

export interface IDeleteMemberGroupV1Params {
  project_name: string;

  user_group_name: string;
}

export interface IDeleteMemberGroupV1Return extends IBaseRes {}

export interface IUpdateMemberGroupV1Params extends IUpdateMemberGroupReqV1 {
  project_name: string;

  user_group_name: string;
}

export interface IUpdateMemberGroupV1Return extends IBaseRes {}

export interface IGetUserGroupTipListV1Params {
  filter_project?: string;
}

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
