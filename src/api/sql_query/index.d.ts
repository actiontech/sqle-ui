import {
  IGetSQLQueryHistoryResV1,
  IPrepareSQLQueryReqV1,
  IPrepareSQLQueryResV1,
  IGetSQLResultResV1
} from '../common.d';

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
  instance_name: string;

  query_id?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetSQLResultReturn extends IGetSQLResultResV1 {}
