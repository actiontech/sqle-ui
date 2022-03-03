/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IGetSQLEInfoV1Return } from './index.d';

class GlobalService extends ServiceBase {
  public getSQLEInfoV1(options?: AxiosRequestConfig) {
    return this.get<IGetSQLEInfoV1Return>('/v1/basic_info', undefined, options);
  }
}

export default new GlobalService();
