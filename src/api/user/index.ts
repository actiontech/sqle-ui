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
  IGetCurrentUserV1Return,
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
  IUpdateUserV1Return
} from './index.d';

class UserService extends ServiceBase {
  public loginV1(params: ILoginV1Params, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<ILoginV1Return>('/v1/login', paramsData, options);
  }

  public testV1(options?: AxiosRequestConfig) {
    return this.get<string>('/v1/test', undefined, options);
  }

  public getCurrentUserV1(options?: AxiosRequestConfig) {
    return this.get<IGetCurrentUserV1Return>('/v1/user', undefined, options);
  }

  public getUserTipListV1(options?: AxiosRequestConfig) {
    return this.get<IGetUserTipListV1Return>(
      '/v1/user_tips',
      undefined,
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
}

export default new UserService();
