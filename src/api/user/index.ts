/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  ILoginV1Params,
  ILoginV1Return,
  ILogoutV1Return,
  IGetMemberTipListV1Params,
  IGetMemberTipListV1Return,
  IGetMembersV1Params,
  IGetMembersV1Return,
  IAddMemberV1Params,
  IAddMemberV1Return,
  IGetMemberV1Params,
  IGetMemberV1Return,
  IDeleteMemberV1Params,
  IDeleteMemberV1Return,
  IUpdateMemberV1Params,
  IUpdateMemberV1Return,
  IGetCurrentUserV1Return,
  IUpdateCurrentUserV1Params,
  IUpdateCurrentUserV1Return,
  IUpdateCurrentUserPasswordV1Params,
  IUpdateCurrentUserPasswordV1Return,
  IGetUserTipListV1Params,
  IGetUserTipListV1Return,
  IGetUserListV1Params,
  IGetUserListV1Return,
  ICreateUserV1Params,
  ICreateUserV1Return,
  IGetUserV1Params,
  IGetUserV1Return,
  IDeleteUserV1Params,
  IDeleteUserV1Return,
  IUpdateUserV1Params,
  IUpdateUserV1Return,
  IUpdateOtherUserPasswordV1Params,
  IUpdateOtherUserPasswordV1Return,
  ILoginV2Params,
  ILoginV2Return
} from './index.d';

class UserService extends ServiceBase {
  public loginV1(params: ILoginV1Params, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<ILoginV1Return>('/v1/login', paramsData, options);
  }

  public logoutV1(options?: AxiosRequestConfig) {
    return this.post<ILogoutV1Return>('/v1/logout', undefined, options);
  }

  public getMemberTipListV1(
    params: IGetMemberTipListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetMemberTipListV1Return>(
      `/v1/projects/${project_name}/member_tips`,
      paramsData,
      options
    );
  }

  public getMembersV1(
    params: IGetMembersV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetMembersV1Return>(
      `/v1/projects/${project_name}/members`,
      paramsData,
      options
    );
  }

  public addMemberV1(params: IAddMemberV1Params, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IAddMemberV1Return>(
      `/v1/projects/${project_name}/members`,
      paramsData,
      options
    );
  }

  public getMemberV1(params: IGetMemberV1Params, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const user_name = paramsData.user_name;
    delete paramsData.user_name;

    return this.get<IGetMemberV1Return>(
      `/v1/projects/${project_name}/members/${user_name}/`,
      paramsData,
      options
    );
  }

  public deleteMemberV1(
    params: IDeleteMemberV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const user_name = paramsData.user_name;
    delete paramsData.user_name;

    return this.delete<IDeleteMemberV1Return>(
      `/v1/projects/${project_name}/members/${user_name}/`,
      paramsData,
      options
    );
  }

  public updateMemberV1(
    params: IUpdateMemberV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const user_name = paramsData.user_name;
    delete paramsData.user_name;

    return this.patch<IUpdateMemberV1Return>(
      `/v1/projects/${project_name}/members/${user_name}/`,
      paramsData,
      options
    );
  }

  public getCurrentUserV1(options?: AxiosRequestConfig) {
    return this.get<IGetCurrentUserV1Return>('/v1/user', undefined, options);
  }

  public updateCurrentUserV1(
    params: IUpdateCurrentUserV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateCurrentUserV1Return>(
      '/v1/user',
      paramsData,
      options
    );
  }

  public UpdateCurrentUserPasswordV1(
    params: IUpdateCurrentUserPasswordV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.put<IUpdateCurrentUserPasswordV1Return>(
      '/v1/user/password',
      paramsData,
      options
    );
  }

  public getUserTipListV1(
    params: IGetUserTipListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserTipListV1Return>(
      '/v1/user_tips',
      paramsData,
      options
    );
  }

  public getUserListV1(
    params: IGetUserListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserListV1Return>('/v1/users', paramsData, options);
  }

  public createUserV1(
    params: ICreateUserV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateUserV1Return>('/v1/users', paramsData, options);
  }

  public getUserV1(params: IGetUserV1Params, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const user_name = paramsData.user_name;
    delete paramsData.user_name;

    return this.get<IGetUserV1Return>(
      `/v1/users/${user_name}/`,
      paramsData,
      options
    );
  }

  public deleteUserV1(
    params: IDeleteUserV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const user_name = paramsData.user_name;
    delete paramsData.user_name;

    return this.delete<IDeleteUserV1Return>(
      `/v1/users/${user_name}/`,
      paramsData,
      options
    );
  }

  public updateUserV1(
    params: IUpdateUserV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const user_name = paramsData.user_name;
    delete paramsData.user_name;

    return this.patch<IUpdateUserV1Return>(
      `/v1/users/${user_name}/`,
      paramsData,
      options
    );
  }

  public UpdateOtherUserPasswordV1(
    params: IUpdateOtherUserPasswordV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const user_name = paramsData.user_name;
    delete paramsData.user_name;

    return this.patch<IUpdateOtherUserPasswordV1Return>(
      `/v1/users/${user_name}/password`,
      paramsData,
      options
    );
  }

  public loginV2(params: ILoginV2Params, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<ILoginV2Return>('/v2/login', paramsData, options);
  }
}

export default new UserService();
