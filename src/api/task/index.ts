/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  ICreateAuditTasksV1Params,
  ICreateAuditTasksV1Return,
  ICreateAndAuditTaskV1Params,
  ICreateAndAuditTaskV1Return,
  IAuditTaskGroupIdV1Params,
  IAuditTaskGroupIdV1Return,
  IGetAuditTaskV1Params,
  IGetAuditTaskV1Return,
  IGetAuditTaskSQLContentV1Params,
  IGetAuditTaskSQLContentV1Return,
  IDownloadAuditTaskSQLFileV1Params,
  IDownloadAuditTaskSQLReportV1Params,
  IGetAuditTaskSQLsV1Params,
  IGetAuditTaskSQLsV1Return,
  IUpdateAuditTaskSQLsV1Params,
  IUpdateAuditTaskSQLsV1Return,
  IGetTaskAnalysisDataParams,
  IGetTaskAnalysisDataReturn,
  IGetAuditTaskSQLsV2Params,
  IGetAuditTaskSQLsV2Return,
  IGetTaskAnalysisDataV2Params,
  IGetTaskAnalysisDataV2Return
} from './index.d';

class TaskService extends ServiceBase {
  public createAuditTasksV1(
    params: ICreateAuditTasksV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateAuditTasksV1Return>(
      `/v1/projects/${project_name}/task_groups`,
      paramsData,
      options
    );
  }

  public createAndAuditTaskV1(
    params: ICreateAndAuditTaskV1Params,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.instance_name != undefined) {
      paramsData.append('instance_name', params.instance_name as any);
    }

    if (params.instance_schema != undefined) {
      paramsData.append('instance_schema', params.instance_schema as any);
    }

    if (params.sql != undefined) {
      paramsData.append('sql', params.sql as any);
    }

    if (params.input_sql_file != undefined) {
      paramsData.append('input_sql_file', params.input_sql_file as any);
    }

    if (params.input_mybatis_xml_file != undefined) {
      paramsData.append(
        'input_mybatis_xml_file',
        params.input_mybatis_xml_file as any
      );
    }

    if (params.input_zip_file != undefined) {
      paramsData.append('input_zip_file', params.input_zip_file as any);
    }

    const project_name = params.project_name;

    return this.post<ICreateAndAuditTaskV1Return>(
      `/v1/projects/${project_name}/tasks/audits`,
      paramsData,
      config
    );
  }

  public auditTaskGroupIdV1(
    params: IAuditTaskGroupIdV1Params,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.task_group_id != undefined) {
      paramsData.append('task_group_id', params.task_group_id as any);
    }

    if (params.sql != undefined) {
      paramsData.append('sql', params.sql as any);
    }

    if (params.input_sql_file != undefined) {
      paramsData.append('input_sql_file', params.input_sql_file as any);
    }

    if (params.input_mybatis_xml_file != undefined) {
      paramsData.append(
        'input_mybatis_xml_file',
        params.input_mybatis_xml_file as any
      );
    }

    if (params.input_zip_file != undefined) {
      paramsData.append('input_zip_file', params.input_zip_file as any);
    }

    return this.post<IAuditTaskGroupIdV1Return>(
      '/v1/task_groups/audit',
      paramsData,
      config
    );
  }

  public getAuditTaskV1(
    params: IGetAuditTaskV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.get<IGetAuditTaskV1Return>(
      `/v1/tasks/audits/${task_id}/`,
      paramsData,
      options
    );
  }

  public getAuditTaskSQLContentV1(
    params: IGetAuditTaskSQLContentV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.get<IGetAuditTaskSQLContentV1Return>(
      `/v1/tasks/audits/${task_id}/sql_content`,
      paramsData,
      options
    );
  }

  public downloadAuditTaskSQLFileV1(
    params: IDownloadAuditTaskSQLFileV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.get<any>(
      `/v1/tasks/audits/${task_id}/sql_file`,
      paramsData,
      options
    );
  }

  public downloadAuditTaskSQLReportV1(
    params: IDownloadAuditTaskSQLReportV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.get<any>(
      `/v1/tasks/audits/${task_id}/sql_report`,
      paramsData,
      options
    );
  }

  public getAuditTaskSQLsV1(
    params: IGetAuditTaskSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.get<IGetAuditTaskSQLsV1Return>(
      `/v1/tasks/audits/${task_id}/sqls`,
      paramsData,
      options
    );
  }

  public updateAuditTaskSQLsV1(
    params: IUpdateAuditTaskSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    const number = paramsData.number;
    delete paramsData.number;

    return this.patch<IUpdateAuditTaskSQLsV1Return>(
      `/v1/tasks/audits/${task_id}/sqls/${number}`,
      paramsData,
      options
    );
  }

  public getTaskAnalysisData(
    params: IGetTaskAnalysisDataParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    const number = paramsData.number;
    delete paramsData.number;

    return this.get<IGetTaskAnalysisDataReturn>(
      `/v1/tasks/audits/${task_id}/sqls/${number}/analysis`,
      paramsData,
      options
    );
  }

  public getAuditTaskSQLsV2(
    params: IGetAuditTaskSQLsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.get<IGetAuditTaskSQLsV2Return>(
      `/v2/tasks/audits/${task_id}/sqls`,
      paramsData,
      options
    );
  }

  public getTaskAnalysisDataV2(
    params: IGetTaskAnalysisDataV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    const number = paramsData.number;
    delete paramsData.number;

    return this.get<IGetTaskAnalysisDataV2Return>(
      `/v2/tasks/audits/${task_id}/sqls/${number}/analysis`,
      paramsData,
      options
    );
  }
}

export default new TaskService();
