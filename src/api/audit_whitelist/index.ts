/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetAuditWhitelistV1Params,
  IGetAuditWhitelistV1Return,
  ICreateAuditWhitelistV1Params,
  ICreateAuditWhitelistV1Return,
  IDeleteAuditWhitelistByIdV1Params,
  IDeleteAuditWhitelistByIdV1Return,
  IUpdateAuditWhitelistByIdV1Params,
  IUpdateAuditWhitelistByIdV1Return
} from './index.d';

class AuditWhitelistService extends ServiceBase {
  public getAuditWhitelistV1(
    params: IGetAuditWhitelistV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetAuditWhitelistV1Return>(
      `/v1/projects/${project_name}/audit_whitelist`,
      paramsData,
      options
    );
  }

  public createAuditWhitelistV1(
    params: ICreateAuditWhitelistV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateAuditWhitelistV1Return>(
      `/v1/projects/${project_name}/audit_whitelist`,
      paramsData,
      options
    );
  }

  public deleteAuditWhitelistByIdV1(
    params: IDeleteAuditWhitelistByIdV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_whitelist_id = paramsData.audit_whitelist_id;
    delete paramsData.audit_whitelist_id;

    return this.delete<IDeleteAuditWhitelistByIdV1Return>(
      `/v1/projects/${project_name}/audit_whitelist/${audit_whitelist_id}/`,
      paramsData,
      options
    );
  }

  public UpdateAuditWhitelistByIdV1(
    params: IUpdateAuditWhitelistByIdV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_whitelist_id = paramsData.audit_whitelist_id;
    delete paramsData.audit_whitelist_id;

    return this.patch<IUpdateAuditWhitelistByIdV1Return>(
      `/v1/projects/${project_name}/audit_whitelist/${audit_whitelist_id}/`,
      paramsData,
      options
    );
  }
}

export default new AuditWhitelistService();
