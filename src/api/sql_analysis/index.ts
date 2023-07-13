/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IDirectGetSQLAnalysisV1Params,
  IDirectGetSQLAnalysisV1Return
} from './index.d';

class SqlAnalysisService extends ServiceBase {
  public directGetSQLAnalysisV1(
    params: IDirectGetSQLAnalysisV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IDirectGetSQLAnalysisV1Return>(
      '/v1/sql_analysis',
      paramsData,
      options
    );
  }
}

export default new SqlAnalysisService();
