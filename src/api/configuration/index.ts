/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSMTPConfigurationV1Return,
  IUpdateSMTPConfigurationV1Params,
  IUpdateSMTPConfigurationV1Return
} from './index.d';

class ConfigurationService extends ServiceBase {
  public getSMTPConfigurationV1(options?: AxiosRequestConfig) {
    return this.get<IGetSMTPConfigurationV1Return>(
      '/v1/configurations/smtp',
      undefined,
      options
    );
  }

  public updateSMTPConfigurationV1(
    params: IUpdateSMTPConfigurationV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateSMTPConfigurationV1Return>(
      '/v1/configurations/smtp',
      paramsData,
      options
    );
  }
}

export default new ConfigurationService();
