import {
  IGetSMTPConfigurationResV1,
  IUpdateSMTPConfigurationReqV1,
  IBaseRes
} from '../common.d';

export interface IGetSMTPConfigurationV1Return
  extends IGetSMTPConfigurationResV1 {}

export interface IUpdateSMTPConfigurationV1Params
  extends IUpdateSMTPConfigurationReqV1 {}

export interface IUpdateSMTPConfigurationV1Return extends IBaseRes {}
