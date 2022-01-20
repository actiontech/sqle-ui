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
  IGetAuditPlanReportSQLsV1Params,
  IGetAuditPlanReportSQLsV1Return,
  IGetAuditPlanReportsV1Params,
  IGetAuditPlanReportsV1Return,
  IGetAuditPlanSQLsV1Params,
  IGetAuditPlanSQLsV1Return,
  IFullSyncAuditPlanSQLsV1Params,
  IFullSyncAuditPlanSQLsV1Return,
  IPartialSyncAuditPlanSQLsV1Params,
  IPartialSyncAuditPlanSQLsV1Return,
  ITriggerAuditPlanV1Params,
  ITriggerAuditPlanV1Return,
  IGetAuditPlanReportSQLsV2Params,
  IGetAuditPlanReportSQLsV2Return,
  IGetAuditPlanSQLsV2Params,
  IGetAuditPlanSQLsV2Return
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

  public getAuditPlansV1(
    params: IGetAuditPlansV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetAuditPlansV1Return>(
      '/v1/audit_plans',
      paramsData,
      options
    );
  }

  public createAuditPlanV1(
    params: ICreateAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateAuditPlanV1Return>(
      '/v1/audit_plans',
      paramsData,
      options
    );
  }

  public getAuditPlanV1(
    params: IGetAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.get<IGetAuditPlanV1Return>(
      `/v1/audit_plans/${audit_plan_name}/`,
      paramsData,
      options
    );
  }

  public deleteAuditPlanV1(
    params: IDeleteAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.delete<IDeleteAuditPlanV1Return>(
      `/v1/audit_plans/${audit_plan_name}/`,
      paramsData,
      options
    );
  }

  public updateAuditPlanV1(
    params: IUpdateAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.patch<IUpdateAuditPlanV1Return>(
      `/v1/audit_plans/${audit_plan_name}/`,
      paramsData,
      options
    );
  }

  public getAuditPlanReportSQLsV1(
    params: IGetAuditPlanReportSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    const audit_plan_report_id = paramsData.audit_plan_report_id;
    delete paramsData.audit_plan_report_id;

    return this.get<IGetAuditPlanReportSQLsV1Return>(
      `/v1/audit_plans/${audit_plan_name}/report/${audit_plan_report_id}/`,
      paramsData,
      options
    );
  }

  public getAuditPlanReportsV1(
    params: IGetAuditPlanReportsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.get<IGetAuditPlanReportsV1Return>(
      `/v1/audit_plans/${audit_plan_name}/reports`,
      paramsData,
      options
    );
  }

  public getAuditPlanSQLsV1(
    params: IGetAuditPlanSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.get<IGetAuditPlanSQLsV1Return>(
      `/v1/audit_plans/${audit_plan_name}/sqls`,
      paramsData,
      options
    );
  }

  public fullSyncAuditPlanSQLsV1(
    params: IFullSyncAuditPlanSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.post<IFullSyncAuditPlanSQLsV1Return>(
      `/v1/audit_plans/${audit_plan_name}/sqls/full`,
      paramsData,
      options
    );
  }

  public partialSyncAuditPlanSQLsV1(
    params: IPartialSyncAuditPlanSQLsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.post<IPartialSyncAuditPlanSQLsV1Return>(
      `/v1/audit_plans/${audit_plan_name}/sqls/partial`,
      paramsData,
      options
    );
  }

  public triggerAuditPlanV1(
    params: ITriggerAuditPlanV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.post<ITriggerAuditPlanV1Return>(
      `/v1/audit_plans/${audit_plan_name}/trigger`,
      paramsData,
      options
    );
  }

  public getAuditPlanReportSQLsV2(
    params: IGetAuditPlanReportSQLsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    const audit_plan_report_id = paramsData.audit_plan_report_id;
    delete paramsData.audit_plan_report_id;

    return this.get<IGetAuditPlanReportSQLsV2Return>(
      `/v2/audit_plans/${audit_plan_name}/report/${audit_plan_report_id}/`,
      paramsData,
      options
    );
  }

  public getAuditPlanSQLsV2(
    params: IGetAuditPlanSQLsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const audit_plan_name = paramsData.audit_plan_name;
    delete paramsData.audit_plan_name;

    return this.get<IGetAuditPlanSQLsV2Return>(
      `/v2/audit_plans/${audit_plan_name}/sqls`,
      paramsData,
      options
    );
  }
}

export default new AuditPlanService();
