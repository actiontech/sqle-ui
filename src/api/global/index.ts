/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IGetSQLEInfoReturn } from './index.d';

class GlobalService extends ServiceBase {
  public getSQLEInfo(options?: AxiosRequestConfig) {
    return this.get<IGetSQLEInfoReturn>('/v1/basic_info', undefined, options);
  }
}

export default new GlobalService();
