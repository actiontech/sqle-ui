/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetUserGroupTipListV1Return,
  IGetUserGroupListV1Params,
  IGetUserGroupListV1Return,
  ICreateUserGroupV1Params,
  ICreateUserGroupV1Return,
  IDeleteUserGroupV1Params,
  IDeleteUserGroupV1Return,
  IUpdateUserGroupV1Params,
  IUpdateUserGroupV1Return
} from './index.d';

class UserGroupService extends ServiceBase {
  public getUserGroupTipListV1(options?: AxiosRequestConfig) {
    return this.get<IGetUserGroupTipListV1Return>(
      '/v1/user_group_tips',
      undefined,
      options
    );
  }

  public getUserGroupListV1(
    params: IGetUserGroupListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserGroupListV1Return>(
      '/v1/user_groups',
      paramsData,
      options
    );
  }

  public CreateUserGroupV1(
    params: ICreateUserGroupV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateUserGroupV1Return>(
      '/v1/user_groups',
      paramsData,
      options
    );
  }

  public deleteUserGroupV1(
    params: IDeleteUserGroupV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const user_group_name = paramsData.user_group_name;
    delete paramsData.user_group_name;

    return this.delete<IDeleteUserGroupV1Return>(
      `/v1/user_groups/${user_group_name}/`,
      paramsData,
      options
    );
  }

  public updateUserGroupV1(
    params: IUpdateUserGroupV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const user_group_name = paramsData.user_group_name;
    delete paramsData.user_group_name;

    return this.patch<IUpdateUserGroupV1Return>(
      `/v1/user_groups/${user_group_name}/`,
      paramsData,
      options
    );
  }
}

export default new UserGroupService();
