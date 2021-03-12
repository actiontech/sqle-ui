import {
  IUserLoginReqV1,
  IGetUserLoginResV1,
  IGetUserTipsResV1,
  IGetUsersResV1,
  ICreateUserReqV1,
  IBaseRes,
  IUserResV1
} from '../common.d';

export interface ILoginV1Params extends IUserLoginReqV1 {}

export interface ILoginV1Return extends IGetUserLoginResV1 {}

export interface IGetUserTipListV1Return extends IGetUserTipsResV1 {}

export interface IGetUserListV1Params {
  filter_user_name?: string;

  filter_role_name?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetUserListV1Return extends IGetUsersResV1 {}

export interface ICreateUserV1Params extends ICreateUserReqV1 {}

export interface ICreateUserV1Return extends IBaseRes {}

export interface IGetUserV1Params {
  user_name: string;
}

export interface IGetUserV1Return extends IUserResV1 {}

export interface IDeleteUserV1Params {
  user_name: string;
}

export interface IDeleteUserV1Return extends IBaseRes {}
