/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetOperationRecordListV1Params,
  IGetOperationRecordListV1Return,
  IGetExportOperationRecordListV1Params,
  IGetOperationActionListReturn,
  IGetOperationTypeNameListReturn
} from './index.d';

class OperationRecordService extends ServiceBase {
  public getOperationRecordListV1(
    params: IGetOperationRecordListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetOperationRecordListV1Return>(
      '/v1/operation_records',
      paramsData,
      options
    );
  }

  public getExportOperationRecordListV1(
    params: IGetExportOperationRecordListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<any>('/v1/operation_records/exports', paramsData, options);
  }

  public getOperationActionList(options?: AxiosRequestConfig) {
    return this.get<IGetOperationActionListReturn>(
      '/v1/operation_records/operation_actions',
      undefined,
      options
    );
  }

  public GetOperationTypeNameList(options?: AxiosRequestConfig) {
    return this.get<IGetOperationTypeNameListReturn>(
      '/v1/operation_records/operation_type_names',
      undefined,
      options
    );
  }
}

export default new OperationRecordService();
