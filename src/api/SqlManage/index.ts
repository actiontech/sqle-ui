/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSqlManageListParams,
  IGetSqlManageListReturn,
  IBatchUpdateSqlManageParams,
  IBatchUpdateSqlManageReturn
} from './index.d';

class SqlManageService extends ServiceBase {
  public GetSqlManageList(
    params: IGetSqlManageListParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSqlManageListReturn>(
      `/v1/projects/${project_name}/sql_manages`,
      paramsData,
      options
    );
  }

  public BatchUpdateSqlManage(
    params: IBatchUpdateSqlManageParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.patch<IBatchUpdateSqlManageReturn>(
      `/v1/projects/${project_name}/sql_manages/batch`,
      paramsData,
      options
    );
  }
}

export default new SqlManageService();
