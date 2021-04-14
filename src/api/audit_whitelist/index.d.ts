import {
  IGetAuditWhitelistResV1,
  ICreateAuditWhitelistReqV1,
  IBaseRes,
  IUpdateAuditWhitelistReqV1
} from '../common.d';

export interface IGetAuditWhitelistV1Params {
  page_index?: string;

  page_size?: string;
}

export interface IGetAuditWhitelistV1Return extends IGetAuditWhitelistResV1 {}

export interface ICreateAuditWhitelistV1Params
  extends ICreateAuditWhitelistReqV1 {}

export interface ICreateAuditWhitelistV1Return extends IBaseRes {}

export interface IDeleteAuditWhitelistByIdV1Params {
  audit_whitelist_id: string;
}

export interface IDeleteAuditWhitelistByIdV1Return extends IBaseRes {}

export interface IUpdateAuditWhitelistByIdV1Params
  extends IUpdateAuditWhitelistReqV1 {
  audit_whitelist_id: string;
}

export interface IUpdateAuditWhitelistByIdV1Return extends IBaseRes {}
