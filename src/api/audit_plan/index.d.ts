import {
  IGetAuditPlanMetasResV1,
  IGetAuditPlanTypesResV1,
  IGetAuditPlansResV1,
  ICreateAuditPlanReqV1,
  IBaseRes,
  IGetAuditPlanResV1,
  IUpdateAuditPlanReqV1,
  IGetAuditPlanNotifyConfigResV1,
  IUpdateAuditPlanNotifyConfigReqV1,
  ITestAuditPlanNotifyConfigResV1,
  IGetAuditPlanReportsResV1,
  IGetAuditPlanReportResV1,
  IGetAuditPlanReportSQLsResV1,
  IGetAuditPlanAnalysisDataResV1,
  IGetAuditPlanSQLsResV1,
  IFullSyncAuditPlanSQLsReqV1,
  IPartialSyncAuditPlanSQLsReqV1,
  ITriggerAuditPlanResV1,
  IGetAuditPlansResV2,
  IGetAuditPlanReportSQLsResV2,
  IGetAuditPlanAnalysisDataResV2,
  IFullSyncAuditPlanSQLsReqV2,
  IPartialSyncAuditPlanSQLsReqV2
} from '../common.d';

export interface IGetAuditPlanMetasV1Params {
  filter_instance_type?: string;
}

export interface IGetAuditPlanMetasV1Return extends IGetAuditPlanMetasResV1 {}

export interface IGetAuditPlanTypesV1Return extends IGetAuditPlanTypesResV1 {}

export interface IGetAuditPlansV1Params {
  project_name: string;

  filter_audit_plan_db_type?: string;

  fuzzy_search_audit_plan_name?: string;

  filter_audit_plan_type?: string;

  filter_audit_plan_instance_name?: string;

  page_index: number;

  page_size: number;
}

export interface IGetAuditPlansV1Return extends IGetAuditPlansResV1 {}

export interface ICreateAuditPlanV1Params extends ICreateAuditPlanReqV1 {
  project_name: string;
}

export interface ICreateAuditPlanV1Return extends IBaseRes {}

export interface IGetAuditPlanV1Params {
  project_name: string;

  audit_plan_name: string;
}

export interface IGetAuditPlanV1Return extends IGetAuditPlanResV1 {}

export interface IDeleteAuditPlanV1Params {
  project_name: string;

  audit_plan_name: string;
}

export interface IDeleteAuditPlanV1Return extends IBaseRes {}

export interface IUpdateAuditPlanV1Params extends IUpdateAuditPlanReqV1 {
  project_name: string;

  audit_plan_name: string;
}

export interface IUpdateAuditPlanV1Return extends IBaseRes {}

export interface IGetAuditPlanNotifyConfigV1Params {
  project_name: string;

  audit_plan_name: string;
}

export interface IGetAuditPlanNotifyConfigV1Return
  extends IGetAuditPlanNotifyConfigResV1 {}

export interface IUpdateAuditPlanNotifyConfigV1Params
  extends IUpdateAuditPlanNotifyConfigReqV1 {
  project_name: string;

  audit_plan_name: string;
}

export interface IUpdateAuditPlanNotifyConfigV1Return extends IBaseRes {}

export interface ITestAuditPlanNotifyConfigV1Params {
  project_name: string;

  audit_plan_name: string;
}

export interface ITestAuditPlanNotifyConfigV1Return
  extends ITestAuditPlanNotifyConfigResV1 {}

export interface IGetAuditPlanReportsV1Params {
  project_name: string;

  audit_plan_name: string;

  page_index: number;

  page_size: number;
}

export interface IGetAuditPlanReportsV1Return
  extends IGetAuditPlanReportsResV1 {}

export interface IGetAuditPlanReportV1Params {
  project_name: string;

  audit_plan_name: string;

  audit_plan_report_id: string;
}

export interface IGetAuditPlanReportV1Return extends IGetAuditPlanReportResV1 {}

export interface IExportAuditPlanReportV1Params {
  project_name: string;

  audit_plan_name: string;

  audit_plan_report_id: string;
}

export interface IGetAuditPlanReportsSQLsV1Params {
  project_name: string;

  audit_plan_name: string;

  audit_plan_report_id: string;

  page_index: number;

  page_size: number;
}

export interface IGetAuditPlanReportsSQLsV1Return
  extends IGetAuditPlanReportSQLsResV1 {}

export interface IGetTaskAnalysisDataParams {
  project_name: string;

  audit_plan_name: string;

  audit_plan_report_id: string;

  number: string;
}

export interface IGetTaskAnalysisDataReturn
  extends IGetAuditPlanAnalysisDataResV1 {}

export interface IGetAuditPlanSQLsV1Params {
  project_name: string;

  audit_plan_name: string;

  page_index: number;

  page_size: number;
}

export interface IGetAuditPlanSQLsV1Return extends IGetAuditPlanSQLsResV1 {}

export interface IFullSyncAuditPlanSQLsV1Params
  extends IFullSyncAuditPlanSQLsReqV1 {
  project_name: string;

  audit_plan_name: string;
}

export interface IFullSyncAuditPlanSQLsV1Return extends IBaseRes {}

export interface IPartialSyncAuditPlanSQLsV1Params
  extends IPartialSyncAuditPlanSQLsReqV1 {
  project_name: string;

  audit_plan_name: string;
}

export interface IPartialSyncAuditPlanSQLsV1Return extends IBaseRes {}

export interface ITriggerAuditPlanV1Params {
  project_name: string;

  audit_plan_name: string;
}

export interface ITriggerAuditPlanV1Return extends ITriggerAuditPlanResV1 {}

export interface IGetAuditPlansV2Params {
  project_name: string;

  filter_audit_plan_db_type?: string;

  fuzzy_search_audit_plan_name?: string;

  filter_audit_plan_type?: string;

  filter_audit_plan_instance_name?: string;

  page_index: number;

  page_size: number;
}

export interface IGetAuditPlansV2Return extends IGetAuditPlansResV2 {}

export interface IGetAuditPlanReportsSQLsParams {
  project_name: string;

  audit_plan_name: string;

  audit_plan_report_id: string;

  page_index: number;

  page_size: number;
}

export interface IGetAuditPlanReportsSQLsReturn
  extends IGetAuditPlanReportSQLsResV2 {}

export interface IGetAuditPlantAnalysisDataV2Params {
  project_name: string;

  audit_plan_name: string;

  audit_plan_report_id: string;

  number: string;
}

export interface IGetAuditPlantAnalysisDataV2Return
  extends IGetAuditPlanAnalysisDataResV2 {}

export interface IFullSyncAuditPlanSQLsV2Params
  extends IFullSyncAuditPlanSQLsReqV2 {
  project_name: string;

  audit_plan_name: string;
}

export interface IFullSyncAuditPlanSQLsV2Return extends IBaseRes {}

export interface IPartialSyncAuditPlanSQLsV2Params
  extends IPartialSyncAuditPlanSQLsReqV2 {
  project_name: string;

  audit_plan_name: string;
}

export interface IPartialSyncAuditPlanSQLsV2Return extends IBaseRes {}
