/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetSQLAuditRecordsV1Params,
  IGetSQLAuditRecordsV1Return,
  ICreateSQLAuditRecordV1Params,
  ICreateSQLAuditRecordV1Return,
  IGetSQLAuditRecordTagTipsV1Params,
  IGetSQLAuditRecordTagTipsV1Return,
  IGetSQLAuditRecordV1Params,
  IGetSQLAuditRecordV1Return,
  IUpdateSQLAuditRecordV1Params,
  IUpdateSQLAuditRecordV1Return
} from './index.d';

class SqlAuditRecordService extends ServiceBase {
  public getSQLAuditRecordsV1(
    params: IGetSQLAuditRecordsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSQLAuditRecordsV1Return>(
      `/v1/projects/${project_name}/sql_audit_records`,
      paramsData,
      options
    );
  }

  public CreateSQLAuditRecordV1(
    params: ICreateSQLAuditRecordV1Params,
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

    if (params.db_type != undefined) {
      paramsData.append('db_type', params.db_type as any);
    }

    if (params.sqls != undefined) {
      paramsData.append('sqls', params.sqls as any);
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

    if (params.git_http_url != undefined) {
      paramsData.append('git_http_url', params.git_http_url as any);
    }

    if (params.git_user_name != undefined) {
      paramsData.append('git_user_name', params.git_user_name as any);
    }

    if (params.git_user_password != undefined) {
      paramsData.append('git_user_password', params.git_user_password as any);
    }

    const project_name = params.project_name;

    return this.post<ICreateSQLAuditRecordV1Return>(
      `/v1/projects/${project_name}/sql_audit_records`,
      paramsData,
      config
    );
  }

  public GetSQLAuditRecordTagTipsV1(
    params: IGetSQLAuditRecordTagTipsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetSQLAuditRecordTagTipsV1Return>(
      `/v1/projects/${project_name}/sql_audit_records/tag_tips`,
      paramsData,
      options
    );
  }

  public getSQLAuditRecordV1(
    params: IGetSQLAuditRecordV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_audit_record_id = paramsData.sql_audit_record_id;
    delete paramsData.sql_audit_record_id;

    return this.get<IGetSQLAuditRecordV1Return>(
      `/v1/projects/${project_name}/sql_audit_records/${sql_audit_record_id}/`,
      paramsData,
      options
    );
  }

  public updateSQLAuditRecordV1(
    params: IUpdateSQLAuditRecordV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const sql_audit_record_id = paramsData.sql_audit_record_id;
    delete paramsData.sql_audit_record_id;

    return this.patch<IUpdateSQLAuditRecordV1Return>(
      `/v1/projects/${project_name}/sql_audit_records/${sql_audit_record_id}/`,
      paramsData,
      options
    );
  }
}

export default new SqlAuditRecordService();
