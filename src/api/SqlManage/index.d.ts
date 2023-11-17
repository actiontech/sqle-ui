import {
  GetSqlManageListFilterSourceEnum,
  GetSqlManageListFilterAuditLevelEnum,
  GetSqlManageListFilterStatusEnum,
  GetSqlManageListSortFieldEnum,
  GetSqlManageListSortOrderEnum,
  exportSqlManageV1FilterSourceEnum,
  exportSqlManageV1FilterAuditLevelEnum,
  exportSqlManageV1FilterStatusEnum,
  exportSqlManageV1SortFieldEnum,
  exportSqlManageV1SortOrderEnum
} from './index.enum';

import {
  IGetSqlManageListResp,
  IBatchUpdateSqlManageReq,
  IBaseRes,
  IGetSqlManageRuleTipsResp
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

  filter_rule_name?: string;

  filter_db_type?: string;

  fuzzy_search_endpoint?: string;

  sort_field?: GetSqlManageListSortFieldEnum;

  sort_order?: GetSqlManageListSortOrderEnum;

  page_index: number;

  page_size: number;
}

export interface IGetSqlManageListReturn extends IGetSqlManageListResp {}

export interface IBatchUpdateSqlManageParams extends IBatchUpdateSqlManageReq {
  project_name: string;
}

export interface IBatchUpdateSqlManageReturn extends IBaseRes {}

export interface IExportSqlManageV1Params {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: string;

  filter_instance_name?: string;

  filter_source?: exportSqlManageV1FilterSourceEnum;

  filter_audit_level?: exportSqlManageV1FilterAuditLevelEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: exportSqlManageV1FilterStatusEnum;

  filter_db_type?: string;

  filter_rule_name?: string;

  fuzzy_search_endpoint?: string;

  sort_field?: exportSqlManageV1SortFieldEnum;

  sort_order?: exportSqlManageV1SortOrderEnum;
}

export interface IGetSqlManageRuleTipsParams {
  project_name: string;
}

export interface IGetSqlManageRuleTipsReturn
  extends IGetSqlManageRuleTipsResp {}
