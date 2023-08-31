/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetAuditPlanMetasV1Params,
  IGetAuditPlanMetasV1Return,
  IGetAuditPlanTypesV1Return,
  IGetAuditPlansV1Params,
  IGetAuditPlansV1Return,
  ICreateAuditPlanV1Params,
  ICreateAuditPlanV1Return,
  IGetAuditPlanV1Params,
  IGetAuditPlanV1Return,
  IDeleteAuditPlanV1Params,
  IDeleteAuditPlanV1Return,
  IUpdateAuditPlanV1Params,
  IUpdateAuditPlanV1Return,
  IGetAuditPlanNotifyConfigV1Params,
  IGetAuditPlanNotifyConfigV1Return,
  IUpdateAuditPlanNotifyConfigV1Params,
  IUpdateAuditPlanNotifyConfigV1Return,
  ITestAuditPlanNotifyConfigV1Params,
  ITestAuditPlanNotifyConfigV1Return,
  IGetAuditPlanReportsV1Params,
  IGetAuditPlanReportsV1Return,
  IGetAuditPlanReportV1Params,
  IGetAuditPlanReportV1Return,
  IExportAuditPlanReportV1Params,
  IGetAuditPlanReportsSQLsV1Params,
  IGetAuditPlanReportsSQLsV1Return,
  IGetTaskAnalysisDataParams,
  IGetTaskAnalysisDataReturn,
  IGetAuditPlanSQLsV1Params,
  IGetAuditPlanSQLsV1Return,
  IFullSyncAuditPlanSQLsV1Params,
  IFullSyncAuditPlanSQLsV1Return,
  IPartialSyncAuditPlanSQLsV1Params,
  IPartialSyncAuditPlanSQLsV1Return,
  ITriggerAuditPlanV1Params,
  ITriggerAuditPlanV1Return,
  IGetAuditPlansV2Params,
  IGetAuditPlansV2Return,
  IGetAuditPlanReportsSQLsParams,
  IGetAuditPlanReportsSQLsReturn,
  IGetAuditPlantAnalysisDataV2Params,
  IGetAuditPlantAnalysisDataV2Return
} from './index.d';

class AuditPlanService extends ServiceBase {
  public getAuditPlanMetasV1(
    params: IGetAuditPlanMetasV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetAuditPlanMetasV1Return>(
      '/v1/audit_plan_metas',
      paramsData,
      options
    );
  }

  public getAuditPlanTypesV1(options?: AxiosRequestConfig) {
    return this.get<IGetAuditPlanTypesV1Return>(
      '/v1/audit_plan_types',
      undefined,
      options
    );
  }

  public getAuditPlansV1(
    params: IGetAuditPlansV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetAuditPlansV1Return>(
      `/v1/projects/${project_name}/audit_plans`,
      paramsData,
      options
    );
  }

  public createAuditPlanV1(
    params: ICreateAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateAuditPlanV1Return>(
      `/v1/projects/${project_name}/audit_plans`,
      paramsData,
      options
    );
  }

  public getAuditPlanV1(
    params: IGetAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.get<IGetAuditPlanV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/`,
      paramsData,
      options
    );
  }

  public deleteAuditPlanV1(
    params: IDeleteAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.delete<IDeleteAuditPlanV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/`,
      paramsData,
      options
    );
  }

  public updateAuditPlanV1(
    params: IUpdateAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.patch<IUpdateAuditPlanV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/`,
      paramsData,
      options
    );
  }

  public getAuditPlanNotifyConfigV1(
    params: IGetAuditPlanNotifyConfigV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.get<IGetAuditPlanNotifyConfigV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/notify_config`,
      paramsData,
      options
    );
  }

  public updateAuditPlanNotifyConfigV1(
    params: IUpdateAuditPlanNotifyConfigV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.patch<IUpdateAuditPlanNotifyConfigV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/notify_config`,
      paramsData,
      options
    );
  }

  public testAuditPlanNotifyConfigV1(
    params: ITestAuditPlanNotifyConfigV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.get<ITestAuditPlanNotifyConfigV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/notify_config/test`,
      paramsData,
      options
    );
  }

  public getAuditPlanReportsV1(
    params: IGetAuditPlanReportsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.get<IGetAuditPlanReportsV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/reports`,
      paramsData,
      options
    );
  }

  public getAuditPlanReportV1(
    params: IGetAuditPlanReportV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    const audit_plan_report_id = paramsData.audit_plan_report_id;
    delete paramsData.audit_plan_report_id;

    return this.get<IGetAuditPlanReportV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/reports/${audit_plan_report_id}/`,
      paramsData,
      options
    );
  }

  public exportAuditPlanReportV1(
    params: IExportAuditPlanReportV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    const audit_plan_report_id = paramsData.audit_plan_report_id;
    delete paramsData.audit_plan_report_id;

    return this.get<any>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/reports/${audit_plan_report_id}/export`,
      paramsData,
      options
    );
  }

  public getAuditPlanReportsSQLsV1(
    params: IGetAuditPlanReportsSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    const audit_plan_report_id = paramsData.audit_plan_report_id;
    delete paramsData.audit_plan_report_id;

    return this.get<IGetAuditPlanReportsSQLsV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/reports/${audit_plan_report_id}/sqls`,
      paramsData,
      options
    );
  }

  public getTaskAnalysisData(
    params: IGetTaskAnalysisDataParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    const audit_plan_report_id = paramsData.audit_plan_report_id;
    delete paramsData.audit_plan_report_id;

    const number = paramsData.number;
    delete paramsData.number;

    return this.get<IGetTaskAnalysisDataReturn>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/reports/${audit_plan_report_id}/sqls/${number}/analysis`,
      paramsData,
      options
    );
  }

  public getAuditPlanSQLsV1(
    params: IGetAuditPlanSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.get<IGetAuditPlanSQLsV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/sqls`,
      paramsData,
      options
    );
  }

  public fullSyncAuditPlanSQLsV1(
    params: IFullSyncAuditPlanSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.post<IFullSyncAuditPlanSQLsV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/sqls/full`,
      paramsData,
      options
    );
  }

  public partialSyncAuditPlanSQLsV1(
    params: IPartialSyncAuditPlanSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.post<IPartialSyncAuditPlanSQLsV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/sqls/partial`,
      paramsData,
      options
    );
  }

  public triggerAuditPlanV1(
    params: ITriggerAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.post<ITriggerAuditPlanV1Return>(
      `/v1/projects/${project_name}/audit_plans/${audit_plan_name}/trigger`,
      paramsData,
      options
    );
  }

  public getAuditPlansV2(
    params: IGetAuditPlansV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetAuditPlansV2Return>(
      `/v2/projects/${project_name}/audit_plans`,
      paramsData,
      options
    );
  }

  public getAuditPlanReportsSQLs(
    params: IGetAuditPlanReportsSQLsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    const audit_plan_report_id = paramsData.audit_plan_report_id;
    delete paramsData.audit_plan_report_id;

    return this.get<IGetAuditPlanReportsSQLsReturn>(
      `/v2/projects/${project_name}/audit_plans/${audit_plan_name}/reports/${audit_plan_report_id}/sqls`,
      paramsData,
      options
    );
  }

  public getAuditPlantAnalysisDataV2(
    params: IGetAuditPlantAnalysisDataV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    const audit_plan_report_id = paramsData.audit_plan_report_id;
    delete paramsData.audit_plan_report_id;

    const number = paramsData.number;
    delete paramsData.number;

    return this.get<IGetAuditPlantAnalysisDataV2Return>(
      `/v2/projects/${project_name}/audit_plans/${audit_plan_name}/reports/${audit_plan_report_id}/sqls/${number}/analysis`,
      paramsData,
      options
    );
  }
}

export default new AuditPlanService();
