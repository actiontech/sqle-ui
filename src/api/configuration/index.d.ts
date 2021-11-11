import {
  IGetDriversResV1,
  IGetLDAPConfigurationResV1,
  ILDAPConfigurationReqV1,
  IBaseRes,
  IGetSMTPConfigurationResV1,
  IUpdateSMTPConfigurationReqV1,
  IGetSystemVariablesResV1,
  IUpdateSystemVariablesReqV1
} from '../common.d';

export interface IGetDriversV1Return extends IGetDriversResV1 {}

export interface IGetLDAPConfigurationV1Return
  extends IGetLDAPConfigurationResV1 {}

export interface IUpdateLDAPConfigurationV1Params
  extends ILDAPConfigurationReqV1 {}

export interface IUpdateLDAPConfigurationV1Return extends IBaseRes {}

export interface IGetSMTPConfigurationV1Return
  extends IGetSMTPConfigurationResV1 {}

export interface IUpdateSMTPConfigurationV1Params
  extends IUpdateSMTPConfigurationReqV1 {}

export interface IUpdateSMTPConfigurationV1Return extends IBaseRes {}

export interface IGetSystemVariablesV1Return extends IGetSystemVariablesResV1 {}

export interface IUpdateSystemVariablesV1Params
  extends IUpdateSystemVariablesReqV1 {}

export interface IUpdateSystemVariablesV1Return extends IBaseRes {}
