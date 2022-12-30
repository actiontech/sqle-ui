import {
  IUserLoginReqV1,
  IGetUserLoginResV1,
  IGetMemberTipsResV1,
  IGetMembersRespV1,
  ICreateMemberReqV1,
  IBaseRes,
  IGetMemberRespV1,
  IUpdateMemberReqV1,
  IGetUserDetailResV1,
  IUpdateCurrentUserReqV1,
  IUpdateCurrentUserPasswordReqV1,
  IGetUserTipsResV1,
  IGetUsersResV1,
  ICreateUserReqV1,
  IUpdateUserReqV1,
  IUpdateOtherUserPasswordReqV1
} from '../common.d';

export interface ILoginV1Params extends IUserLoginReqV1 {}

export interface ILoginV1Return extends IGetUserLoginResV1 {}

export interface IGetMemberTipListV1Params {
  project_name: string;
}

export interface IGetMemberTipListV1Return extends IGetMemberTipsResV1 {}

export interface IGetMembersV1Params {
  filter_user_name?: string;

  filter_instance_name?: string;

  page_index: number;

  page_size: number;

  project_name: string;
}

export interface IGetMembersV1Return extends IGetMembersRespV1 {}

export interface IAddMemberV1Params extends ICreateMemberReqV1 {
  project_name: string;
}

export interface IAddMemberV1Return extends IBaseRes {}

export interface IGetMemberV1Params {
  project_name: string;

  user_name: string;
}

export interface IGetMemberV1Return extends IGetMemberRespV1 {}

export interface IDeleteMemberV1Params {
  project_name: string;

  user_name: string;
}

export interface IDeleteMemberV1Return extends IBaseRes {}

export interface IUpdateMemberV1Params extends IUpdateMemberReqV1 {
  project_name: string;

  user_name: string;
}

export interface IUpdateMemberV1Return extends IBaseRes {}

export interface IGetCurrentUserV1Return extends IGetUserDetailResV1 {}

export interface IUpdateCurrentUserV1Params extends IUpdateCurrentUserReqV1 {}

export interface IUpdateCurrentUserV1Return extends IBaseRes {}

export interface IUpdateCurrentUserPasswordV1Params
  extends IUpdateCurrentUserPasswordReqV1 {}

export interface IUpdateCurrentUserPasswordV1Return extends IBaseRes {}

export interface IGetUserTipListV1Params {
  filter_project?: string;
}

export interface IGetUserTipListV1Return extends IGetUserTipsResV1 {}

export interface IGetUserListV1Params {
  filter_user_name?: string;

  page_index: number;

  page_size: number;
}

export interface IGetUserListV1Return extends IGetUsersResV1 {}

export interface ICreateUserV1Params extends ICreateUserReqV1 {}

export interface ICreateUserV1Return extends IBaseRes {}

export interface IGetUserV1Params {
  user_name: string;
}

export interface IGetUserV1Return extends IGetUserDetailResV1 {}

export interface IDeleteUserV1Params {
  user_name: string;
}

export interface IDeleteUserV1Return extends IBaseRes {}

export interface IUpdateUserV1Params extends IUpdateUserReqV1 {
  user_name: string;
}

export interface IUpdateUserV1Return extends IBaseRes {}

export interface IUpdateOtherUserPasswordV1Params
  extends IUpdateOtherUserPasswordReqV1 {
  user_name: string;
}

export interface IUpdateOtherUserPasswordV1Return extends IBaseRes {}
