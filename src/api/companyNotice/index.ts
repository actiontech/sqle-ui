/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetCompanyNoticeReturn,
  IUpdateCompanyNoticeParams,
  IUpdateCompanyNoticeReturn
} from './index.d';

class CompanyNoticeService extends ServiceBase {
  public getCompanyNotice(options?: AxiosRequestConfig) {
    return this.get<IGetCompanyNoticeReturn>(
      '/v1/company_notice',
      undefined,
      options
    );
  }

  public updateCompanyNotice(
    params: IUpdateCompanyNoticeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateCompanyNoticeReturn>(
      '/v1/company_notice',
      paramsData,
      options
    );
  }
}

export default new CompanyNoticeService();
