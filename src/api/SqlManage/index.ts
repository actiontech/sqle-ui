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
  IBatchUpdateSqlManageReturn,
  IExportSqlManageV1Params,
  IGetSqlManageRuleTipsParams,
  IGetSqlManageRuleTipsReturn,
  IGetSqlManageSqlAnalysisV1Params,
  IGetSqlManageSqlAnalysisV1Return,
  IGetSqlManageListV2Params,
  IGetSqlManageListV2Return
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

  public exportSqlManageV1(
    params: IExportSqlManageV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<any>(
      `/v1/projects/${project_name}/sql_manages/exports`,
      paramsData,
      options
    );
  }

  public GetSqlManageRuleTips(
    params: IGetSqlManageRuleTipsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSqlManageRuleTipsReturn>(
      `/v1/projects/${project_name}/sql_manages/rule_tips`,
      paramsData,
      options
    );
  }

  public GetSqlManageSqlAnalysisV1(
    params: IGetSqlManageSqlAnalysisV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_manage_id = paramsData.sql_manage_id;
    delete paramsData.sql_manage_id;

    return this.get<IGetSqlManageSqlAnalysisV1Return>(
      `/v1/projects/${project_name}/sql_manages/${sql_manage_id}/sql_analysis`,
      paramsData,
      options
    );
  }

  public GetSqlManageListV2(
    params: IGetSqlManageListV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSqlManageListV2Return>(
      `/v2/projects/${project_name}/sql_manages`,
      paramsData,
      options
    );
  }
}

export default new SqlManageService();
