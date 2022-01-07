/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  ICheckInstanceIsConnectableV1Params,
  ICheckInstanceIsConnectableV1Return,
  IGetInstanceTipListV1Params,
  IGetInstanceTipListV1Return,
  IGetInstanceListV1Params,
  IGetInstanceListV1Return,
  ICreateInstanceV1Params,
  ICreateInstanceV1Return,
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
  IGetInstanceWorkflowTemplateV1Params,
  IGetInstanceWorkflowTemplateV1Return
} from './index.d';

class InstanceService extends ServiceBase {
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
    return this.get<IGetInstanceTipListV1Return>(
      '/v1/instance_tips',
      paramsData,
      options
    );
  }

  public getInstanceListV1(
    params: IGetInstanceListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetInstanceListV1Return>(
      '/v1/instances',
      paramsData,
      options
    );
  }

  public createInstanceV1(
    params: ICreateInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateInstanceV1Return>(
      '/v1/instances',
      paramsData,
      options
    );
  }

  public getInstanceV1(
    params: IGetInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceV1Return>(
      `/v1/instances/${instance_name}/`,
      paramsData,
      options
    );
  }

  public deleteInstanceV1(
    params: IDeleteInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.delete<IDeleteInstanceV1Return>(
      `/v1/instances/${instance_name}/`,
      paramsData,
      options
    );
  }

  public updateInstanceV1(
    params: IUpdateInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.patch<IUpdateInstanceV1Return>(
      `/v1/instances/${instance_name}/`,
      paramsData,
      options
    );
  }

  public checkInstanceIsConnectableByNameV1(
    params: ICheckInstanceIsConnectableByNameV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<ICheckInstanceIsConnectableByNameV1Return>(
      `/v1/instances/${instance_name}/connection`,
      paramsData,
      options
    );
  }

  public getInstanceRuleListV1(
    params: IGetInstanceRuleListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceRuleListV1Return>(
      `/v1/instances/${instance_name}/rules`,
      paramsData,
      options
    );
  }

  public getInstanceSchemasV1(
    params: IGetInstanceSchemasV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceSchemasV1Return>(
      `/v1/instances/${instance_name}/schemas`,
      paramsData,
      options
    );
  }

  public getInstanceWorkflowTemplateV1(
    params: IGetInstanceWorkflowTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const instance_name = paramsData.instance_name;
    delete paramsData.instance_name;

    return this.get<IGetInstanceWorkflowTemplateV1Return>(
      `/v1/instances/${instance_name}/workflow_template`,
      paramsData,
      options
    );
  }
}

export default new InstanceService();
