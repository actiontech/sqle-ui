/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetDingTalkConfigurationV1Return,
  IUpdateDingTalkConfigurationV1Params,
  IUpdateDingTalkConfigurationV1Return,
  ITestDingTalkConfigV1Return,
  IGetDriversV1Return,
  IGetFeishuConfigurationV1Return,
  IUpdateFeishuConfigurationV1Params,
  IUpdateFeishuConfigurationV1Return,
  ITestFeishuConfigV1Params,
  ITestFeishuConfigV1Return,
  IGetLDAPConfigurationV1Return,
  IUpdateLDAPConfigurationV1Params,
  IUpdateLDAPConfigurationV1Return,
  IGetSQLELicenseV1Return,
  ISetSQLELicenseV1Params,
  ISetSQLELicenseV1Return,
  ICheckSQLELicenseV1Params,
  ICheckSQLELicenseV1Return,
  IGetOauth2ConfigurationV1Return,
  IUpdateOauth2ConfigurationV1Params,
  IUpdateOauth2ConfigurationV1Return,
  IGetOauth2TipsReturn,
  IPersonaliseParams,
  IPersonaliseReturn,
  IUploadLogoParams,
  IUploadLogoReturn,
  IGetSMTPConfigurationV1Return,
  IUpdateSMTPConfigurationV1Params,
  IUpdateSMTPConfigurationV1Return,
  ITestSMTPConfigurationV1Params,
  ITestSMTPConfigurationV1Return,
  IGetSQLQueryConfigurationReturn,
  IGetSystemVariablesV1Return,
  IUpdateSystemVariablesV1Params,
  IUpdateSystemVariablesV1Return,
  IGetWeChatConfigurationV1Return,
  IUpdateWeChatConfigurationV1Params,
  IUpdateWeChatConfigurationV1Return,
  ITestWeChatConfigurationV1Params,
  ITestWeChatConfigurationV1Return,
  IGetLogoParams,
  IGetDriversV2Return,
} from './index.d';

class ConfigurationService extends ServiceBase {
  public getDingTalkConfigurationV1(options?: AxiosRequestConfig) {
    return this.get<IGetDingTalkConfigurationV1Return>(
      '/v1/configurations/ding_talk',
      undefined,
      options
    );
  }

  public updateDingTalkConfigurationV1(
    params: IUpdateDingTalkConfigurationV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateDingTalkConfigurationV1Return>(
      '/v1/configurations/ding_talk',
      paramsData,
      options
    );
  }

  public testDingTalkConfigV1(options?: AxiosRequestConfig) {
    return this.post<ITestDingTalkConfigV1Return>(
      '/v1/configurations/ding_talk/test',
      undefined,
      options
    );
  }

  public getDriversV1(options?: AxiosRequestConfig) {
    return this.get<IGetDriversV1Return>(
      '/v1/configurations/drivers',
      undefined,
      options
    );
  }

  public getFeishuConfigurationV1(options?: AxiosRequestConfig) {
    return this.get<IGetFeishuConfigurationV1Return>(
      '/v1/configurations/feishu',
      undefined,
      options
    );
  }

  public updateFeishuConfigurationV1(
    params: IUpdateFeishuConfigurationV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateFeishuConfigurationV1Return>(
      '/v1/configurations/feishu',
      paramsData,
      options
    );
  }

  public testFeishuConfigV1(
    params: ITestFeishuConfigV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestFeishuConfigV1Return>(
      '/v1/configurations/feishu/test',
      paramsData,
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
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data',
    };

    const paramsData = new FormData();

    if (params.license_file != undefined) {
      paramsData.append('license_file', params.license_file as any);
    }

    return this.post<ISetSQLELicenseV1Return>(
      '/v1/configurations/license',
      paramsData,
      config
    );
  }

  public checkSQLELicenseV1(
    params: ICheckSQLELicenseV1Params,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data',
    };

    const paramsData = new FormData();

    if (params.license_file != undefined) {
      paramsData.append('license_file', params.license_file as any);
    }

    return this.post<ICheckSQLELicenseV1Return>(
      '/v1/configurations/license/check',
      paramsData,
      config
    );
  }

  public GetSQLELicenseInfoV1(options?: AxiosRequestConfig) {
    return this.get<any>('/v1/configurations/license/info', undefined, options);
  }

  public getOauth2ConfigurationV1(options?: AxiosRequestConfig) {
    return this.get<IGetOauth2ConfigurationV1Return>(
      '/v1/configurations/oauth2',
      undefined,
      options
    );
  }

  public updateOauth2ConfigurationV1(
    params: IUpdateOauth2ConfigurationV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateOauth2ConfigurationV1Return>(
      '/v1/configurations/oauth2',
      paramsData,
      options
    );
  }

  public getOauth2Tips(options?: AxiosRequestConfig) {
    return this.get<IGetOauth2TipsReturn>(
      '/v1/configurations/oauth2/tips',
      undefined,
      options
    );
  }

  public personalise(params: IPersonaliseParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IPersonaliseReturn>(
      '/v1/configurations/personalise',
      paramsData,
      options
    );
  }

  public uploadLogo(params: IUploadLogoParams, options?: AxiosRequestConfig) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data',
    };

    const paramsData = new FormData();

    if (params.logo != undefined) {
      paramsData.append('logo', params.logo as any);
    }

    return this.post<IUploadLogoReturn>(
      '/v1/configurations/personalise/logo',
      paramsData,
      config
    );
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

  public testSMTPConfigurationV1(
    params: ITestSMTPConfigurationV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestSMTPConfigurationV1Return>(
      '/v1/configurations/smtp/test',
      paramsData,
      options
    );
  }

  public getSQLQueryConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetSQLQueryConfigurationReturn>(
      '/v1/configurations/sql_query',
      undefined,
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

  public getWeChatConfigurationV1(options?: AxiosRequestConfig) {
    return this.get<IGetWeChatConfigurationV1Return>(
      '/v1/configurations/wechat',
      undefined,
      options
    );
  }

  public updateWeChatConfigurationV1(
    params: IUpdateWeChatConfigurationV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateWeChatConfigurationV1Return>(
      '/v1/configurations/wechat',
      paramsData,
      options
    );
  }

  public testWeChatConfigurationV1(
    params: ITestWeChatConfigurationV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestWeChatConfigurationV1Return>(
      '/v1/configurations/wechat/test',
      paramsData,
      options
    );
  }

  public getLogo(params: IGetLogoParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.get<any>('/v1/static/logo', paramsData, options);
  }

  public getDriversV2(options?: AxiosRequestConfig) {
    return this.get<IGetDriversV2Return>(
      '/v2/configurations/drivers',
      undefined,
      options
    );
  }
}

export default new ConfigurationService();
