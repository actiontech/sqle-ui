/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IDirectAuditV1Params, IDirectAuditV1Return } from './index.d';

class SqlAuditService extends ServiceBase {
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
}

export default new SqlAuditService();
