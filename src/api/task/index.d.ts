import {
  IGetAuditTaskResV1,
  IGetAuditTaskSQLContentResV1,
  IGetAuditTaskSQLsResV1
} from '../common.d';

import {
  getAuditTaskSQLsV1FilterExecStatusEnum,
  getAuditTaskSQLsV1FilterAuditStatusEnum
} from './index.enum';

export interface ICreateAndAuditTaskV1Params {
  instance_name: string;

  instance_schema?: string;

  sql?: string;

  input_sql_file?: any;
}

export interface ICreateAndAuditTaskV1Return extends IGetAuditTaskResV1 {}

export interface IGetAuditTaskV1Params {
  task_id: string;
}

export interface IGetAuditTaskV1Return extends IGetAuditTaskResV1 {}

export interface IGetAuditTaskSQLContentV1Params {
  task_id: string;
}

export interface IGetAuditTaskSQLContentV1Return
  extends IGetAuditTaskSQLContentResV1 {}

export interface IDownloadAuditTaskSQLFileV1Params {
  task_id: string;
}

export interface IDownloadAuditTaskSQLReportV1Params {
  task_id: string;

  no_duplicate?: boolean;
}

export interface IGetAuditTaskSQLsV1Params {
  task_id: string;

  filter_exec_status?: getAuditTaskSQLsV1FilterExecStatusEnum;

  filter_audit_status?: getAuditTaskSQLsV1FilterAuditStatusEnum;

  no_duplicate?: boolean;

  page_index?: string;

  page_size?: string;
}

export interface IGetAuditTaskSQLsV1Return extends IGetAuditTaskSQLsResV1 {}
