import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from './index.enum';

import {
  IGetSQLAuditRecordsResV1,
  ICreateSQLAuditRecordResV1,
  IGetSQLAuditRecordTagTipsResV1,
  IGetSQLAuditRecordResV1,
  IUpdateSQLAuditRecordReqV1,
  IBaseRes
} from '../common.d';

export interface IGetSQLAuditRecordsV1Params {
  fuzzy_search_tags?: string;

  filter_sql_audit_status?: getSQLAuditRecordsV1FilterSqlAuditStatusEnum;

  filter_instance_name?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  page_index: number;

  page_size: number;

  project_name: string;
}

export interface IGetSQLAuditRecordsV1Return extends IGetSQLAuditRecordsResV1 {}

export interface ICreateSQLAuditRecordV1Params {
  project_name: string;

  instance_name?: string;

  instance_schema?: string;

  db_type?: string;

  sqls?: string;

  input_sql_file?: any;

  input_mybatis_xml_file?: any;

  input_zip_file?: any;

  git_http_url?: string;

  git_user_name?: string;

  git_user_password?: string;
}

export interface ICreateSQLAuditRecordV1Return
  extends ICreateSQLAuditRecordResV1 {}

export interface IGetSQLAuditRecordTagTipsV1Params {
  project_name: string;
}

export interface IGetSQLAuditRecordTagTipsV1Return
  extends IGetSQLAuditRecordTagTipsResV1 {}

export interface IGetSQLAuditRecordV1Params {
  project_name: string;

  sql_audit_record_id: string;
}

export interface IGetSQLAuditRecordV1Return extends IGetSQLAuditRecordResV1 {}

export interface IUpdateSQLAuditRecordV1Params
  extends IUpdateSQLAuditRecordReqV1 {
  project_name: string;

  sql_audit_record_id: string;
}

export interface IUpdateSQLAuditRecordV1Return extends IBaseRes {}
