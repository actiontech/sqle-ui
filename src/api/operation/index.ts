/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IGetOperationsV1Return } from './index.d';

class OperationService extends ServiceBase {
  public GetOperationsV1(options?: AxiosRequestConfig) {
    return this.get<IGetOperationsV1Return>(
      '/v1/operations',
      undefined,
      options
    );
  }
}

export default new OperationService();
