/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetDriversV1Return,
  IGetLDAPConfigurationV1Return,
  IUpdateLDAPConfigurationV1Params,
  IUpdateLDAPConfigurationV1Return,
  IGetSQLELicenseV1Return,
  ISetSQLELicenseV1Params,
  ISetSQLELicenseV1Return,
  ICheckSQLELicenseV1Params,
  ICheckSQLELicenseV1Return,
  IGetSMTPConfigurationV1Return,
  IUpdateSMTPConfigurationV1Params,
  IUpdateSMTPConfigurationV1Return,
  IGetSystemVariablesV1Return,
  IUpdateSystemVariablesV1Params,
  IUpdateSystemVariablesV1Return
} from './index.d';

class ConfigurationService extends ServiceBase {
  public getDriversV1(options?: AxiosRequestConfig) {
    return this.get<IGetDriversV1Return>(
      '/v1/configurations/drivers',
      undefined,
      options
    );
  }

  public getLDAPConfigurationV1(options?: AxiosRequestConfig) {
    return this.get<IGetLDAPConfigurationV1Return>(
      '/v1/configurations/ldap',
      undefined,
      options
    );
  }

  public updateLDAPConfigurationV1(
    params: IUpdateLDAPConfigurationV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateLDAPConfigurationV1Return>(
      '/v1/configurations/ldap',
      paramsData,
      options
    );
  }

  public getSQLELicenseV1(options?: AxiosRequestConfig) {
    return this.get<IGetSQLELicenseV1Return>(
      '/v1/configurations/license',
      undefined,
      options
    );
  }

  public setSQLELicenseV1(
    params: ISetSQLELicenseV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ISetSQLELicenseV1Return>(
      '/v1/configurations/license',
      paramsData,
      options
    );
  }

  public checkSQLELicenseV1(
    params: ICheckSQLELicenseV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICheckSQLELicenseV1Return>(
      '/v1/configurations/license/check',
      paramsData,
      options
    );
  }

  public GetSQLELicenseInfoV1(options?: AxiosRequestConfig) {
    return this.get<any>('/v1/configurations/license/info', undefined, options);
  }

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

  public getSystemVariablesV1(options?: AxiosRequestConfig) {
    return this.get<IGetSystemVariablesV1Return>(
      '/v1/configurations/system_variables',
      undefined,
      options
    );
  }

  public updateSystemVariablesV1(
    params: IUpdateSystemVariablesV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateSystemVariablesV1Return>(
      '/v1/configurations/system_variables',
      paramsData,
      options
    );
  }
}

export default new ConfigurationService();
