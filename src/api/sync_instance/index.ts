/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSyncInstanceTaskListReturn,
  ICreateSyncInstanceTaskV1Params,
  ICreateSyncInstanceTaskV1Return,
  IGetSyncTaskSourceTipsReturn,
  IGetSyncInstanceTaskParams,
  IGetSyncInstanceTaskReturn,
  IDeleteSyncInstanceTaskV1Params,
  IDeleteSyncInstanceTaskV1Return,
  IUpdateSyncInstanceTaskV1Params,
  IUpdateSyncInstanceTaskV1Return,
  ITriggerSyncInstanceV1Params,
  ITriggerSyncInstanceV1Return
} from './index.d';

class SyncInstanceService extends ServiceBase {
  public GetSyncInstanceTaskList(options?: AxiosRequestConfig) {
    return this.get<IGetSyncInstanceTaskListReturn>(
      '/v1/sync_instance',
      undefined,
      options
    );
  }

  public createSyncInstanceTaskV1(
    params: ICreateSyncInstanceTaskV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateSyncInstanceTaskV1Return>(
      '/v1/sync_instance',
      paramsData,
      options
    );
  }

  public GetSyncTaskSourceTips(options?: AxiosRequestConfig) {
    return this.get<IGetSyncTaskSourceTipsReturn>(
      '/v1/sync_instance/source_tips',
      undefined,
      options
    );
  }

  public GetSyncInstanceTask(
    params: IGetSyncInstanceTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.get<IGetSyncInstanceTaskReturn>(
      `/v1/sync_instance/${task_id}/`,
      paramsData,
      options
    );
  }

  public deleteSyncInstanceTaskV1(
    params: IDeleteSyncInstanceTaskV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.delete<IDeleteSyncInstanceTaskV1Return>(
      `/v1/sync_instance/${task_id}/`,
      paramsData,
      options
    );
  }

  public updateSyncInstanceTaskV1(
    params: IUpdateSyncInstanceTaskV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.patch<IUpdateSyncInstanceTaskV1Return>(
      `/v1/sync_instance/${task_id}/`,
      paramsData,
      options
    );
  }

  public triggerSyncInstanceV1(
    params: ITriggerSyncInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.post<ITriggerSyncInstanceV1Return>(
      `/v1/sync_instance/${task_id}/trigger`,
      paramsData,
      options
    );
  }
}

export default new SyncInstanceService();
