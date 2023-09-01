import {
  IDirectAuditFileReqV1,
  IDirectAuditResV1,
  IDirectAuditReqV1,
  IDirectAuditReqV2,
  IDirectAuditResV2
} from '../common.d';

export interface IDirectAuditFilesV1Params extends IDirectAuditFileReqV1 {}

export interface IDirectAuditFilesV1Return extends IDirectAuditResV1 {}

export interface IDirectAuditV1Params extends IDirectAuditReqV1 {}

export interface IDirectAuditV1Return extends IDirectAuditResV1 {}

export interface IDirectAuditV2Params extends IDirectAuditReqV2 {}

export interface IDirectAuditV2Return extends IDirectAuditResV2 {}
