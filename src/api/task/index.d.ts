import {
  IGetAuditTaskResV1,
  IGetAuditTaskSQLContentResV1,
  IGetAuditTaskSQLsResV1,
  IUpdateAuditTaskSQLsReqV1,
  IBaseRes
} from '../common.d';

import {
  getAuditTaskSQLsV1FilterExecStatusEnum,
  getAuditTaskSQLsV1FilterAuditStatusEnum,
  getAuditTaskSQLsV1FilterAuditLevelEnum
} from './index.enum';

export interface ICreateAndAuditTaskV1Params {
  instance_name: string;

  instance_schema?: string;

  sql?: string;

  input_sql_file?: any;

  input_mybatis_xml_file?: any;
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

  filter_audit_level?: getAuditTaskSQLsV1FilterAuditLevelEnum;

  no_duplicate?: boolean;

  page_index?: string;

  page_size?: string;
}

export interface IGetAuditTaskSQLsV1Return extends IGetAuditTaskSQLsResV1 {}

export interface IUpdateAuditTaskSQLsV1Params
  extends IUpdateAuditTaskSQLsReqV1 {
  task_id: string;

  number: string;
}

export interface IUpdateAuditTaskSQLsV1Return extends IBaseRes {}
