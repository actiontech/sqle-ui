/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetMemberGroupsV1Params,
  IGetMemberGroupsV1Return,
  IAddMemberGroupV1Params,
  IAddMemberGroupV1Return,
  IGetMemberGroupV1Params,
  IGetMemberGroupV1Return,
  IDeleteMemberGroupV1Params,
  IDeleteMemberGroupV1Return,
  IUpdateMemberGroupV1Params,
  IUpdateMemberGroupV1Return,
  IGetUserGroupTipListV1Params,
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
  public getMemberGroupsV1(
    params: IGetMemberGroupsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_id = paramsData.project_id;
    delete paramsData.project_id;

    return this.get<IGetMemberGroupsV1Return>(
      `/v1/projects/${project_id}/member_groups`,
      paramsData,
      options
    );
  }

  public addMemberGroupV1(
    params: IAddMemberGroupV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_id = paramsData.project_id;
    delete paramsData.project_id;

    return this.post<IAddMemberGroupV1Return>(
      `/v1/projects/${project_id}/member_groups`,
      paramsData,
      options
    );
  }

  public getMemberGroupV1(
    params: IGetMemberGroupV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_id = paramsData.project_id;
    delete paramsData.project_id;

    const user_group_name = paramsData.user_group_name;
    delete paramsData.user_group_name;

    return this.get<IGetMemberGroupV1Return>(
      `/v1/projects/${project_id}/member_groups/${user_group_name}/`,
      paramsData,
      options
    );
  }

  public deleteMemberGroupV1(
    params: IDeleteMemberGroupV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_id = paramsData.project_id;
    delete paramsData.project_id;

    const user_group_name = paramsData.user_group_name;
    delete paramsData.user_group_name;

    return this.delete<IDeleteMemberGroupV1Return>(
      `/v1/projects/${project_id}/member_groups/${user_group_name}/`,
      paramsData,
      options
    );
  }

  public updateMemberGroupV1(
    params: IUpdateMemberGroupV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_id = paramsData.project_id;
    delete paramsData.project_id;

    const user_group_name = paramsData.user_group_name;
    delete paramsData.user_group_name;

    return this.patch<IUpdateMemberGroupV1Return>(
      `/v1/projects/${project_id}/member_groups/${user_group_name}/`,
      paramsData,
      options
    );
  }

  public getUserGroupTipListV1(
    params: IGetUserGroupTipListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserGroupTipListV1Return>(
      '/v1/user_group_tips',
      paramsData,
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
