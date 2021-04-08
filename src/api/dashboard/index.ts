/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IGetDashboardV1Return } from './index.d';

class DashboardService extends ServiceBase {
  public getDashboardV1(options?: AxiosRequestConfig) {
    return this.get<IGetDashboardV1Return>('/v1/dashboard', undefined, options);
  }
}

export default new DashboardService();
