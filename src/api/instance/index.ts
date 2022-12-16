/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetInstanceAdditionalMetasReturn,
  ICheckInstanceIsConnectableV1Params,
  ICheckInstanceIsConnectableV1Return,
  IGetInstanceTipListV1Params,
  IGetInstanceTipListV1Return,
  IGetInstanceListV1Params,
  IGetInstanceListV1Return,
  ICreateInstanceV1Params,
  ICreateInstanceV1Return,
  IBatchCheckInstanceIsConnectableByNameParams,
  IBatchCheckInstanceIsConnectableByNameReturn,
  IGetInstanceV1Params,
  IGetInstanceV1Return,
  IDeleteInstanceV1Params,
  IDeleteInstanceV1Return,
  IUpdateInstanceV1Params,
  IUpdateInstanceV1Return,
  ICheckInstanceIsConnectableByNameV1Params,
  ICheckInstanceIsConnectableByNameV1Return,
  IGetInstanceRuleListV1Params,
  IGetInstanceRuleListV1Return,
  IGetInstanceSchemasV1Params,
  IGetInstanceSchemasV1Return,
  IListTableBySchemaParams,
  IListTableBySchemaReturn,
  IGetTableMetadataParams,
  IGetTableMetadataReturn,
  IGetInstanceListV2Params,
  IGetInstanceListV2Return
} from './index.d';

class InstanceService extends ServiceBase {
  public getInstanceAdditionalMetas(options?: AxiosRequestConfig) {
    return this.get<IGetInstanceAdditionalMetasReturn>(
      '/v1/instance_additional_metas',
      undefined,
      options
    );
  }

  public checkInstanceIsConnectableV1(
    params: ICheckInstanceIsConnectableV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICheckInstanceIsConnectableV1Return>(
      '/v1/instance_connection',
      paramsData,
      options
    );
  }

  public getInstanceTipListV1(
    params: IGetInstanceTipListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetInstanceTipListV1Return>(
      `/v1/projects/${project_name}/instance_tips`,
      paramsData,
      options
    );
  }

  public getInstanceListV1(
    params: IGetInstanceListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetInstanceListV1Return>(
      `/v1/projects/${project_name}/instances`,
      paramsData,
      options
    );
  }

  public createInstanceV1(
    params: ICreateInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateInstanceV1Return>(
      `/v1/projects/${project_name}/instances`,
      paramsData,
      options
    );
  }

  public batchCheckInstanceIsConnectableByName(
    params: IBatchCheckInstanceIsConnectableByNameParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<IBatchCheckInstanceIsConnectableByNameReturn>(
      `/v1/projects/${project_name}/instances/connections`,
      paramsData,
      options
    );
  }

  public getInstanceV1(
    params: IGetInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceV1Return>(
      `/v1/projects/${project_name}/instances/${instance_name}/`,
      paramsData,
      options
    );
  }

  public deleteInstanceV1(
    params: IDeleteInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.delete<IDeleteInstanceV1Return>(
      `/v1/projects/${project_name}/instances/${instance_name}/`,
      paramsData,
      options
    );
  }

  public updateInstanceV1(
    params: IUpdateInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.patch<IUpdateInstanceV1Return>(
      `/v1/projects/${project_name}/instances/${instance_name}/`,
      paramsData,
      options
    );
  }

  public checkInstanceIsConnectableByNameV1(
    params: ICheckInstanceIsConnectableByNameV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<ICheckInstanceIsConnectableByNameV1Return>(
      `/v1/projects/${project_name}/instances/${instance_name}/connection`,
      paramsData,
      options
    );
  }

  public getInstanceRuleListV1(
    params: IGetInstanceRuleListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceRuleListV1Return>(
      `/v1/projects/${project_name}/instances/${instance_name}/rules`,
      paramsData,
      options
    );
  }

  public getInstanceSchemasV1(
    params: IGetInstanceSchemasV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceSchemasV1Return>(
      `/v1/projects/${project_name}/instances/${instance_name}/schemas`,
      paramsData,
      options
    );
  }

  public listTableBySchema(
    params: IListTableBySchemaParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    const schema_name = paramsData.schema_name;
    delete paramsData.schema_name;

    return this.get<IListTableBySchemaReturn>(
      `/v1/projects/${project_name}/instances/${instance_name}/schemas/${schema_name}/tables`,
      paramsData,
      options
    );
  }

  public getTableMetadata(
    params: IGetTableMetadataParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    const schema_name = paramsData.schema_name;
    delete paramsData.schema_name;

    const table_name = paramsData.table_name;
    delete paramsData.table_name;

    return this.get<IGetTableMetadataReturn>(
      `/v1/projects/${project_name}/instances/${instance_name}/schemas/${schema_name}/tables/${table_name}/metadata`,
      paramsData,
      options
    );
  }

  public getInstanceListV2(
    params: IGetInstanceListV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetInstanceListV2Return>(
      `/v2/projects/${project_name}/instances`,
      paramsData,
      options
    );
  }
}

export default new InstanceService();
