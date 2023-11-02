import {
  IDirectAuditFileReqV1,
  IDirectAuditResV1,
  IDirectAuditReqV1,
  IDirectAuditFileReqV2,
  IDirectAuditResV2,
  IDirectAuditReqV2
} from '../common.d';

export interface IDirectAuditFilesV1Params extends IDirectAuditFileReqV1 {}

export interface IDirectAuditFilesV1Return extends IDirectAuditResV1 {}

export interface IDirectAuditV1Params extends IDirectAuditReqV1 {}

export interface IDirectAuditV1Return extends IDirectAuditResV1 {}

export interface IDirectAuditFilesV2Params extends IDirectAuditFileReqV2 {}

export interface IDirectAuditFilesV2Return extends IDirectAuditResV2 {}

export interface IDirectAuditV2Params extends IDirectAuditReqV2 {}

export interface IDirectAuditV2Return extends IDirectAuditResV2 {}
