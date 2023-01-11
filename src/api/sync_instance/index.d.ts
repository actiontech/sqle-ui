import {
  IGetSyncInstanceTaskListResV1,
  ICreateSyncInstanceTaskReqV1,
  IBaseRes,
  IGetSyncTaskSourceTipsResV1,
  IGetSyncInstanceTaskResV1,
  IUpdateSyncInstanceTaskReqV1,
  ITriggerSyncInstanceResV1
} from '../common.d';

export interface IGetSyncInstanceTaskListReturn
  extends IGetSyncInstanceTaskListResV1 {}

export interface ICreateSyncInstanceTaskV1Params
  extends ICreateSyncInstanceTaskReqV1 {}

export interface ICreateSyncInstanceTaskV1Return extends IBaseRes {}

export interface IGetSyncTaskSourceTipsReturn
  extends IGetSyncTaskSourceTipsResV1 {}

export interface IGetSyncInstanceTaskParams {
  task_id: string;
}

export interface IGetSyncInstanceTaskReturn extends IGetSyncInstanceTaskResV1 {}

export interface IDeleteSyncInstanceTaskV1Params {
  task_id: string;
}

export interface IDeleteSyncInstanceTaskV1Return extends IBaseRes {}

export interface IUpdateSyncInstanceTaskV1Params
  extends IUpdateSyncInstanceTaskReqV1 {
  task_id: string;
}

export interface IUpdateSyncInstanceTaskV1Return extends IBaseRes {}

export interface ITriggerSyncInstanceV1Params {
  task_id: string;
}

export interface ITriggerSyncInstanceV1Return
  extends ITriggerSyncInstanceResV1 {}
