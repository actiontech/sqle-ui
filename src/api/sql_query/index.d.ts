import {
  IGetSqlExplainReqV1,
  IGetSQLExplainResV1,
  IGetSQLQueryHistoryResV1,
  IPrepareSQLQueryReqV1,
  IPrepareSQLQueryResV1,
  IGetSQLResultResV1
} from '../common.d';

export interface IGetSQLExplainParams extends IGetSqlExplainReqV1 {
  instance_name: string;
}

export interface IGetSQLExplainReturn extends IGetSQLExplainResV1 {}

export interface IGetSQLQueryHistoryParams {
  instance_name: string;

  filter_fuzzy_search?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetSQLQueryHistoryReturn extends IGetSQLQueryHistoryResV1 {}

export interface IPrepareSQLQueryParams extends IPrepareSQLQueryReqV1 {
  instance_name: string;
}

export interface IPrepareSQLQueryReturn extends IPrepareSQLQueryResV1 {}

export interface IGetSQLResultParams {
  query_id: string;

  page_index: number;

  page_size: number;
}

export interface IGetSQLResultReturn extends IGetSQLResultResV1 {}
