/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IStatisticAuditPlanV1Params,
  IStatisticAuditPlanV1Return,
  IStatisticsAuditedSQLV1Params,
  IStatisticsAuditedSQLV1Return,
  IGetInstanceHealthV1Params,
  IGetInstanceHealthV1Return,
  IGetProjectScoreV1Params,
  IGetProjectScoreV1Return,
  IGetRiskAuditPlanV1Params,
  IGetRiskAuditPlanV1Return,
  IStatisticRiskWorkflowV1Params,
  IStatisticRiskWorkflowV1Return,
  IGetRoleUserCountV1Params,
  IGetRoleUserCountV1Return,
  IStatisticWorkflowStatusV1Params,
  IStatisticWorkflowStatusV1Return,
  IGetProjectStatisticsV1Params,
  IGetProjectStatisticsV1Return,
  IGetSqlAverageExecutionTimeV1Params,
  IGetSqlAverageExecutionTimeV1Return,
  IGetSqlExecutionFailPercentV1Params,
  IGetSqlExecutionFailPercentV1Return,
  IGetInstancesTypePercentV1Return,
  IGetLicenseUsageV1Return,
  IGetWorkflowAuditPassPercentV1Return,
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
  public statisticAuditPlanV1(
    params: IStatisticAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IStatisticAuditPlanV1Return>(
      `/v1/projects/${project_name}/statistic/audit_plans`,
      paramsData,
      options
    );
  }

  public statisticsAuditedSQLV1(
    params: IStatisticsAuditedSQLV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IStatisticsAuditedSQLV1Return>(
      `/v1/projects/${project_name}/statistic/audited_sqls`,
      paramsData,
      options
    );
  }

  public GetInstanceHealthV1(
    params: IGetInstanceHealthV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetInstanceHealthV1Return>(
      `/v1/projects/${project_name}/statistic/instance_health`,
      paramsData,
      options
    );
  }

  public GetProjectScoreV1(
    params: IGetProjectScoreV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetProjectScoreV1Return>(
      `/v1/projects/${project_name}/statistic/project_score`,
      paramsData,
      options
    );
  }

  public getRiskAuditPlanV1(
    params: IGetRiskAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetRiskAuditPlanV1Return>(
      `/v1/projects/${project_name}/statistic/risk_audit_plans`,
      paramsData,
      options
    );
  }

  public statisticRiskWorkflowV1(
    params: IStatisticRiskWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IStatisticRiskWorkflowV1Return>(
      `/v1/projects/${project_name}/statistic/risk_workflow`,
      paramsData,
      options
    );
  }

  public getRoleUserCountV1(
    params: IGetRoleUserCountV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetRoleUserCountV1Return>(
      `/v1/projects/${project_name}/statistic/role_user`,
      paramsData,
      options
    );
  }

  public statisticWorkflowStatusV1(
    params: IStatisticWorkflowStatusV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IStatisticWorkflowStatusV1Return>(
      `/v1/projects/${project_name}/statistic/workflow_status`,
      paramsData,
      options
    );
  }

  public getProjectStatisticsV1(
    params: IGetProjectStatisticsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetProjectStatisticsV1Return>(
      `/v1/projects/${project_name}/statistics`,
      paramsData,
      options
    );
  }

  public getSqlAverageExecutionTimeV1(
    params: IGetSqlAverageExecutionTimeV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetSqlAverageExecutionTimeV1Return>(
      '/v1/statistic/instances/sql_average_execution_time',
      paramsData,
      options
    );
  }

  public getSqlExecutionFailPercentV1(
    params: IGetSqlExecutionFailPercentV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetSqlExecutionFailPercentV1Return>(
      '/v1/statistic/instances/sql_execution_fail_percent',
      paramsData,
      options
    );
  }

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

  public getWorkflowAuditPassPercentV1(options?: AxiosRequestConfig) {
    return this.get<IGetWorkflowAuditPassPercentV1Return>(
      '/v1/statistic/workflows/audit_pass_percent',
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
