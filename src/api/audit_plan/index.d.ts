import {
  IGetAuditPlanMetasResV1,
  IGetAuditPlansResV1,
  ICreateAuditPlanReqV1,
  IBaseRes,
  IGetAuditPlanResV1,
  IUpdateAuditPlanReqV1,
  IGetAuditPlanNotifyConfigResV1,
  IUpdateAuditPlanNotifyConfigReqV1,
  ITestAuditPlanNotifyConfigResV1,
  IGetAuditPlanReportSQLsResV1,
  IGetAuditPlanReportsResV1,
  IGetAuditPlanReportResV1,
  IGetAuditPlanSQLsResV1,
  IFullSyncAuditPlanSQLsReqV1,
  IPartialSyncAuditPlanSQLsReqV1,
  ITriggerAuditPlanResV1,
  IGetAuditPlanReportSQLsResV2,
  IGetAuditPlanSQLsResV2
} from '../common.d';

export interface IGetAuditPlanMetasV1Params {
  filter_instance_type?: string;
}

export interface IGetAuditPlanMetasV1Return extends IGetAuditPlanMetasResV1 {}

export interface IGetAuditPlansV1Params {
  filter_audit_plan_db_type?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetAuditPlansV1Return extends IGetAuditPlansResV1 {}

export interface ICreateAuditPlanV1Params extends ICreateAuditPlanReqV1 {}

export interface ICreateAuditPlanV1Return extends IBaseRes {}

export interface IGetAuditPlanV1Params {
  audit_plan_name: string;
}

export interface IGetAuditPlanV1Return extends IGetAuditPlanResV1 {}

export interface IDeleteAuditPlanV1Params {
  audit_plan_name: string;
}

export interface IDeleteAuditPlanV1Return extends IBaseRes {}

export interface IUpdateAuditPlanV1Params extends IUpdateAuditPlanReqV1 {
  audit_plan_name: string;
}

export interface IUpdateAuditPlanV1Return extends IBaseRes {}

export interface IGetAuditPlanNotifyConfigV1Params {
  audit_plan_name: string;
}

export interface IGetAuditPlanNotifyConfigV1Return
  extends IGetAuditPlanNotifyConfigResV1 {}

export interface IUpdateAuditPlanNotifyConfigV1Params
  extends IUpdateAuditPlanNotifyConfigReqV1 {
  audit_plan_name: string;
}

export interface IUpdateAuditPlanNotifyConfigV1Return extends IBaseRes {}

export interface ITestAuditPlanNotifyConfigV1Params {
  audit_plan_name: string;
}

export interface ITestAuditPlanNotifyConfigV1Return
  extends ITestAuditPlanNotifyConfigResV1 {}

export interface IGetAuditPlanReportSQLsV1Params {
  audit_plan_name: string;

  audit_plan_report_id: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetAuditPlanReportSQLsV1Return
  extends IGetAuditPlanReportSQLsResV1 {}

export interface IGetAuditPlanReportsV1Params {
  audit_plan_name: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetAuditPlanReportsV1Return
  extends IGetAuditPlanReportsResV1 {}

export interface IGetAuditPlanReportV1Params {
  audit_plan_name: string;

  audit_plan_report_id: string;
}

export interface IGetAuditPlanReportV1Return extends IGetAuditPlanReportResV1 {}

export interface IGetAuditPlanSQLsV1Params {
  audit_plan_name: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetAuditPlanSQLsV1Return extends IGetAuditPlanSQLsResV1 {}

export interface IFullSyncAuditPlanSQLsV1Params
  extends IFullSyncAuditPlanSQLsReqV1 {
  audit_plan_name: string;
}

export interface IFullSyncAuditPlanSQLsV1Return extends IBaseRes {}

export interface IPartialSyncAuditPlanSQLsV1Params
  extends IPartialSyncAuditPlanSQLsReqV1 {
  audit_plan_name: string;
}

export interface IPartialSyncAuditPlanSQLsV1Return extends IBaseRes {}

export interface ITriggerAuditPlanV1Params {
  audit_plan_name: string;
}

export interface ITriggerAuditPlanV1Return extends ITriggerAuditPlanResV1 {}

export interface IGetAuditPlanReportSQLsV2Params {
  audit_plan_name: string;

  audit_plan_report_id: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetAuditPlanReportSQLsV2Return
  extends IGetAuditPlanReportSQLsResV2 {}

export interface IGetAuditPlanReportsSQLsV2Params {
  audit_plan_name: string;

  audit_plan_report_id: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetAuditPlanReportsSQLsV2Return
  extends IGetAuditPlanReportSQLsResV2 {}

export interface IGetAuditPlanSQLsV2Params {
  audit_plan_name: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetAuditPlanSQLsV2Return extends IGetAuditPlanSQLsResV2 {}
