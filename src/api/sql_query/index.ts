/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSQLExplainParams,
  IGetSQLExplainReturn,
  IGetSQLQueryHistoryParams,
  IGetSQLQueryHistoryReturn,
  IPrepareSQLQueryParams,
  IPrepareSQLQueryReturn,
  IGetSQLResultParams,
  IGetSQLResultReturn
} from './index.d';

class SqlQueryService extends ServiceBase {
  public getSQLExplain(
    params: IGetSQLExplainParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.post<IGetSQLExplainReturn>(
      `/v1/sql_query/explain/${instance_name}/`,
      paramsData,
      options
    );
  }

  public getSQLQueryHistory(
    params: IGetSQLQueryHistoryParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetSQLQueryHistoryReturn>(
      `/v1/sql_query/history/${instance_name}/`,
      paramsData,
      options
    );
  }

  public prepareSQLQuery(
    params: IPrepareSQLQueryParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.post<IPrepareSQLQueryReturn>(
      `/v1/sql_query/prepare/${instance_name}/`,
      paramsData,
      options
    );
  }

  public getSQLResult(
    params: IGetSQLResultParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const query_id = paramsData.query_id;
    delete paramsData.query_id;

    return this.get<IGetSQLResultReturn>(
      `/v1/sql_query/results/${query_id}/`,
      paramsData,
      options
    );
  }
}

export default new SqlQueryService();
