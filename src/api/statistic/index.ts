/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetInstancesTypePercentV1Return,
  IGetLicenseUsageV1Return,
  IGetWorkflowCountV1Return,
  IGetWorkflowDurationOfWaitingForAuditV1Return,
  IGetWorkflowDurationOfWaitingForExecutionV1Return,
  IGetWorkflowCreatedCountEachDayV1Params,
  IGetWorkflowCreatedCountEachDayV1Return,
  IGetWorkflowPercentCountedByInstanceTypeV1Return,
  IGetWorkflowPassPercentV1Return,
  IGetWorkflowRejectedPercentGroupByCreatorV1Params,
  IGetWorkflowRejectedPercentGroupByCreatorV1Return,
  IGetWorkflowRejectedPercentGroupByInstanceV1Params,
  IGetWorkflowRejectedPercentGroupByInstanceV1Return,
  IGetWorkflowStatusCountV1Return
} from './index.d';

class StatisticService extends ServiceBase {
  public getInstancesTypePercentV1(options?: AxiosRequestConfig) {
    return this.get<IGetInstancesTypePercentV1Return>(
      '/v1/statistic/instances/type_percent',
      undefined,
      options
    );
  }

  public getLicenseUsageV1(options?: AxiosRequestConfig) {
    return this.get<IGetLicenseUsageV1Return>(
      '/v1/statistic/license/usage',
      undefined,
      options
    );
  }

  public getWorkflowCountV1(options?: AxiosRequestConfig) {
    return this.get<IGetWorkflowCountV1Return>(
      '/v1/statistic/workflows/counts',
      undefined,
      options
    );
  }

  public getWorkflowDurationOfWaitingForAuditV1(options?: AxiosRequestConfig) {
    return this.get<IGetWorkflowDurationOfWaitingForAuditV1Return>(
      '/v1/statistic/workflows/duration_of_waiting_for_audit',
      undefined,
      options
    );
  }

  public getWorkflowDurationOfWaitingForExecutionV1(
    options?: AxiosRequestConfig
  ) {
    return this.get<IGetWorkflowDurationOfWaitingForExecutionV1Return>(
      '/v1/statistic/workflows/duration_of_waiting_for_execution',
      undefined,
      options
    );
  }

  public getWorkflowCreatedCountEachDayV1(
    params: IGetWorkflowCreatedCountEachDayV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetWorkflowCreatedCountEachDayV1Return>(
      '/v1/statistic/workflows/each_day_counts',
      paramsData,
      options
    );
  }

  public getWorkflowPercentCountedByInstanceTypeV1(
    options?: AxiosRequestConfig
  ) {
    return this.get<IGetWorkflowPercentCountedByInstanceTypeV1Return>(
      '/v1/statistic/workflows/instance_type_percent',
      undefined,
      options
    );
  }

  public getWorkflowPassPercentV1(options?: AxiosRequestConfig) {
    return this.get<IGetWorkflowPassPercentV1Return>(
      '/v1/statistic/workflows/pass_percent',
      undefined,
      options
    );
  }

  public getWorkflowRejectedPercentGroupByCreatorV1(
    params: IGetWorkflowRejectedPercentGroupByCreatorV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetWorkflowRejectedPercentGroupByCreatorV1Return>(
      '/v1/statistic/workflows/rejected_percent_group_by_creator',
      paramsData,
      options
    );
  }

  public getWorkflowRejectedPercentGroupByInstanceV1(
    params: IGetWorkflowRejectedPercentGroupByInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetWorkflowRejectedPercentGroupByInstanceV1Return>(
      '/v1/statistic/workflows/rejected_percent_group_by_instance',
      paramsData,
      options
    );
  }

  public getWorkflowStatusCountV1(options?: AxiosRequestConfig) {
    return this.get<IGetWorkflowStatusCountV1Return>(
      '/v1/statistic/workflows/status_count',
      undefined,
      options
    );
  }
}

export default new StatisticService();
