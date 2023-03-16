/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetDashboardV1Params,
  IGetDashboardV1Return,
  IGetDashboardProjectTipsV1Return
} from './index.d';

class DashboardService extends ServiceBase {
  public getDashboardV1(
    params: IGetDashboardV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetDashboardV1Return>(
      '/v1/dashboard',
      paramsData,
      options
    );
  }

  public getDashboardProjectTipsV1(options?: AxiosRequestConfig) {
    return this.get<IGetDashboardProjectTipsV1Return>(
      '/v1/dashboard/project_tips',
      undefined,
      options
    );
  }
}

export default new DashboardService();
