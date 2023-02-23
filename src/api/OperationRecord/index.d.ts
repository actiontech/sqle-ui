import {
  IGetOperationRecordListResV1,
  IGetOperationActionListResV1,
  IGetOperationTypeNamesListResV1
} from '../common.d';

export interface IGetOperationRecordListV1Params {
  filter_operate_time_from?: string;

  filter_operate_time_to?: string;

  filter_operate_project_name?: string;

  fuzzy_search_operate_user_name?: string;

  filter_operate_type_name?: string;

  filter_operate_action?: string;

  page_index: number;

  page_size: number;
}

export interface IGetOperationRecordListV1Return
  extends IGetOperationRecordListResV1 {}

export interface IGetExportOperationRecordListV1Params {
  filter_operate_time_from?: string;

  filter_operate_time_to?: string;

  filter_operate_project_name?: string;

  fuzzy_search_operate_user_name?: string;

  filter_operate_type_name?: string;

  filter_operate_action?: string;
}

export interface IGetOperationActionListReturn
  extends IGetOperationActionListResV1 {}

export interface IGetOperationTypeNameListReturn
  extends IGetOperationTypeNamesListResV1 {}
