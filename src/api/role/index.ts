/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetRoleTipListV1Return,
  IGetRoleListV1Params,
  IGetRoleListV1Return,
  ICreateRoleV1Params,
  ICreateRoleV1Return,
  IDeleteRoleV1Params,
  IDeleteRoleV1Return,
  IUpdateRoleV1Params,
  IUpdateRoleV1Return,
  IGetRoleListV2Params,
  IGetRoleListV2Return,
  ICreateRoleV2Params,
  ICreateRoleV2Return,
  IUpdateRoleV2Params,
  IUpdateRoleV2Return
} from './index.d';

class RoleService extends ServiceBase {
  public getRoleTipListV1(options?: AxiosRequestConfig) {
    return this.get<IGetRoleTipListV1Return>(
      '/v1/role_tips',
      undefined,
      options
    );
  }

  public getRoleListV1(
    params: IGetRoleListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetRoleListV1Return>('/v1/roles', paramsData, options);
  }

  public createRoleV1(
    params: ICreateRoleV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateRoleV1Return>('/v1/roles', paramsData, options);
  }

  public deleteRoleV1(
    params: IDeleteRoleV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const role_name = paramsData.role_name;
    delete paramsData.role_name;

    return this.delete<IDeleteRoleV1Return>(
      `/v1/roles/${role_name}/`,
      paramsData,
      options
    );
  }

  public updateRoleV1(
    params: IUpdateRoleV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const role_name = paramsData.role_name;
    delete paramsData.role_name;

    return this.patch<IUpdateRoleV1Return>(
      `/v1/roles/${role_name}/`,
      paramsData,
      options
    );
  }

  public getRoleListV2(
    params: IGetRoleListV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetRoleListV2Return>('/v2/roles', paramsData, options);
  }

  public createRoleV2(
    params: ICreateRoleV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateRoleV2Return>('/v2/roles', paramsData, options);
  }

  public updateRoleV2(
    params: IUpdateRoleV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const role_name = paramsData.role_name;
    delete paramsData.role_name;

    return this.patch<IUpdateRoleV2Return>(
      `/v2/roles/${role_name}/`,
      paramsData,
      options
    );
  }
}

export default new RoleService();
