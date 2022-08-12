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
  IGetTaskRejectedPercentGroupByCreatorV1Params,
  IGetTaskRejectedPercentGroupByCreatorV1Return,
  IGetTaskRejectedPercentGroupByInstanceV1Params,
  IGetTaskRejectedPercentGroupByInstanceV1Return,
  IGetTaskCountV1Return,
  IGetTaskDurationOfWaitingForAuditV1Return,
  IGetTaskDurationOfWaitingForExecutionV1Return,
  IGetTaskCreatedCountEachDayV1Params,
  IGetTaskCreatedCountEachDayV1Return,
  IGetTasksPercentCountedByInstanceTypeV1Return,
  IGetTaskPassPercentV1Return,
  IGetTaskStatusCountV1Return
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

  public getTaskRejectedPercentGroupByCreatorV1(
    params: IGetTaskRejectedPercentGroupByCreatorV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetTaskRejectedPercentGroupByCreatorV1Return>(
      '/v1/statistic/task/rejected_percent_group_by_creator',
      paramsData,
      options
    );
  }

  public getTaskRejectedPercentGroupByInstanceV1(
    params: IGetTaskRejectedPercentGroupByInstanceV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetTaskRejectedPercentGroupByInstanceV1Return>(
      '/v1/statistic/task/rejected_percent_group_by_instance',
      paramsData,
      options
    );
  }

  public getTaskCountV1(options?: AxiosRequestConfig) {
    return this.get<IGetTaskCountV1Return>(
      '/v1/statistic/tasks/counts',
      undefined,
      options
    );
  }

  public getTaskDurationOfWaitingForAuditV1(options?: AxiosRequestConfig) {
    return this.get<IGetTaskDurationOfWaitingForAuditV1Return>(
      '/v1/statistic/tasks/duration_of_waiting_for_audit',
      undefined,
      options
    );
  }

  public getTaskDurationOfWaitingForExecutionV1(options?: AxiosRequestConfig) {
    return this.get<IGetTaskDurationOfWaitingForExecutionV1Return>(
      '/v1/statistic/tasks/duration_of_waiting_for_execution',
      undefined,
      options
    );
  }

  public getTaskCreatedCountEachDayV1(
    params: IGetTaskCreatedCountEachDayV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetTaskCreatedCountEachDayV1Return>(
      '/v1/statistic/tasks/each_day_counts',
      paramsData,
      options
    );
  }

  public getTasksPercentCountedByInstanceTypeV1(options?: AxiosRequestConfig) {
    return this.get<IGetTasksPercentCountedByInstanceTypeV1Return>(
      '/v1/statistic/tasks/instance_type_percent',
      undefined,
      options
    );
  }

  public getTaskPassPercentV1(options?: AxiosRequestConfig) {
    return this.get<IGetTaskPassPercentV1Return>(
      '/v1/statistic/tasks/pass_percent',
      undefined,
      options
    );
  }

  public getTaskStatusCountV1(options?: AxiosRequestConfig) {
    return this.get<IGetTaskStatusCountV1Return>(
      '/v1/statistic/tasks/status_count',
      undefined,
      options
    );
  }
}

export default new StatisticService();
