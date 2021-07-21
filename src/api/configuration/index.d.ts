import {
  IGetDriversResV1,
  IGetSMTPConfigurationResV1,
  IUpdateSMTPConfigurationReqV1,
  IBaseRes,
  IGetSystemVariablesResV1,
  IUpdateSystemVariablesReqV1
} from '../common.d';

export interface IGetDriversV1Return extends IGetDriversResV1 {}

export interface IGetSMTPConfigurationV1Return
  extends IGetSMTPConfigurationResV1 {}

export interface IUpdateSMTPConfigurationV1Params
  extends IUpdateSMTPConfigurationReqV1 {}

export interface IUpdateSMTPConfigurationV1Return extends IBaseRes {}

export interface IGetSystemVariablesV1Return extends IGetSystemVariablesResV1 {}

export interface IUpdateSystemVariablesV1Params
  extends IUpdateSystemVariablesReqV1 {}

export interface IUpdateSystemVariablesV1Return extends IBaseRes {}
