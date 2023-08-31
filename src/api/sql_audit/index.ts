/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IDirectAuditFilesV1Params,
  IDirectAuditFilesV1Return,
  IDirectAuditV1Params,
  IDirectAuditV1Return,
  IDirectAuditV2Params,
  IDirectAuditV2Return
} from './index.d';

class SqlAuditService extends ServiceBase {
  public directAuditFilesV1(
    params: IDirectAuditFilesV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IDirectAuditFilesV1Return>(
      '/v1/audit_files',
      paramsData,
      options
    );
  }

  public directAuditV1(
    params: IDirectAuditV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IDirectAuditV1Return>(
      '/v1/sql_audit',
      paramsData,
      options
    );
  }

  public directAuditV2(
    params: IDirectAuditV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IDirectAuditV2Return>(
      '/v2/sql_audit',
      paramsData,
      options
    );
  }
}

export default new SqlAuditService();
