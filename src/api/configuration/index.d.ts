import {
  IGetDriversResV1,
  IGetLDAPConfigurationResV1,
  ILDAPConfigurationReqV1,
  IBaseRes,
  IGetLicenseResV1,
  ICheckLicenseResV1,
  IGetOauth2ConfigurationResV1,
  IOauth2ConfigurationReqV1,
  IGetOauth2TipsResV1,
  IGetSMTPConfigurationResV1,
  IUpdateSMTPConfigurationReqV1,
  ITestSMTPConfigurationReqV1,
  ITestSMTPConfigurationResV1,
  IGetSystemVariablesResV1,
  IUpdateSystemVariablesReqV1,
  IGetWeChatConfigurationResV1,
  IUpdateWeChatConfigurationReqV1,
  ITestWeChatConfigurationReqV1,
  ITestWeChatConfigurationResV1
} from '../common.d';

export interface IGetDriversV1Return extends IGetDriversResV1 {}

export interface IGetLDAPConfigurationV1Return
  extends IGetLDAPConfigurationResV1 {}

export interface IUpdateLDAPConfigurationV1Params
  extends ILDAPConfigurationReqV1 {}

export interface IUpdateLDAPConfigurationV1Return extends IBaseRes {}

export interface IGetSQLELicenseV1Return extends IGetLicenseResV1 {}

export interface ISetSQLELicenseV1Params {
  license_file: any;
}

export interface ISetSQLELicenseV1Return extends IBaseRes {}

export interface ICheckSQLELicenseV1Params {
  license_file: any;
}

export interface ICheckSQLELicenseV1Return extends ICheckLicenseResV1 {}

export interface IGetOauth2ConfigurationV1Return
  extends IGetOauth2ConfigurationResV1 {}

export interface IUpdateOauth2ConfigurationV1Params
  extends IOauth2ConfigurationReqV1 {}

export interface IUpdateOauth2ConfigurationV1Return extends IBaseRes {}

export interface IGetOauth2TipsReturn extends IGetOauth2TipsResV1 {}

export interface IGetSMTPConfigurationV1Return
  extends IGetSMTPConfigurationResV1 {}

export interface IUpdateSMTPConfigurationV1Params
  extends IUpdateSMTPConfigurationReqV1 {}

export interface IUpdateSMTPConfigurationV1Return extends IBaseRes {}

export interface ITestSMTPConfigurationV1Params
  extends ITestSMTPConfigurationReqV1 {}

export interface ITestSMTPConfigurationV1Return
  extends ITestSMTPConfigurationResV1 {}

export interface IGetSystemVariablesV1Return extends IGetSystemVariablesResV1 {}

export interface IUpdateSystemVariablesV1Params
  extends IUpdateSystemVariablesReqV1 {}

export interface IUpdateSystemVariablesV1Return extends IBaseRes {}

export interface IGetWeChatConfigurationV1Return
  extends IGetWeChatConfigurationResV1 {}

export interface IUpdateWeChatConfigurationV1Params
  extends IUpdateWeChatConfigurationReqV1 {}

export interface IUpdateWeChatConfigurationV1Return extends IBaseRes {}

export interface ITestWeChatConfigurationV1Params
  extends ITestWeChatConfigurationReqV1 {}

export interface ITestWeChatConfigurationV1Return
  extends ITestWeChatConfigurationResV1 {}
