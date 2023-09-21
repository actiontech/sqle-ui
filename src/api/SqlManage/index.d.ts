import {
  GetSqlManageListFilterSourceEnum,
  GetSqlManageListFilterAuditLevelEnum,
  GetSqlManageListFilterStatusEnum
} from './index.enum';

import {
  IGetSqlManageListResp,
  IBatchUpdateSqlManageReq,
  IBaseRes
} from '../common.d';

export interface IGetSqlManageListParams {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: string;

  filter_instance_name?: string;

  filter_source?: GetSqlManageListFilterSourceEnum;

  filter_audit_level?: GetSqlManageListFilterAuditLevelEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: GetSqlManageListFilterStatusEnum;

  page_index: number;

  page_size: number;
}

export interface IGetSqlManageListReturn extends IGetSqlManageListResp {}

export interface IBatchUpdateSqlManageParams extends IBatchUpdateSqlManageReq {
  project_name: string;
}

export interface IBatchUpdateSqlManageReturn extends IBaseRes {}
