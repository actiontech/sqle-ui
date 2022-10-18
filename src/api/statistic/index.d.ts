import {
  IGetSqlAverageExecutionTimeResV1,
  IGetSqlExecutionFailPercentResV1,
  IGetInstancesTypePercentResV1,
  IGetLicenseUsageResV1,
  IGetWorkflowAuditPassPercentResV1,
  IGetWorkflowCountsResV1,
  IGetWorkflowDurationOfWaitingForAuditResV1,
  IGetWorkflowDurationOfWaitingForExecutionResV1,
  IGetWorkflowCreatedCountsEachDayResV1,
  IGetWorkflowPercentCountedByInstanceTypeResV1,
  IGetWorkflowPassPercentResV1,
  IGetWorkflowRejectedPercentGroupByCreatorResV1,
  IGetWorkflowRejectedPercentGroupByInstanceResV1,
  IGetWorkflowStatusCountResV1
} from '../common.d';

export interface IGetSqlAverageExecutionTimeV1Params {
  limit: number;
}

export interface IGetSqlAverageExecutionTimeV1Return
  extends IGetSqlAverageExecutionTimeResV1 {}

export interface IGetSqlExecutionFailPercentV1Params {
  limit: number;
}

export interface IGetSqlExecutionFailPercentV1Return
  extends IGetSqlExecutionFailPercentResV1 {}

export interface IGetInstancesTypePercentV1Return
  extends IGetInstancesTypePercentResV1 {}

export interface IGetLicenseUsageV1Return extends IGetLicenseUsageResV1 {}

export interface IGetWorkflowAuditPassPercentV1Return
  extends IGetWorkflowAuditPassPercentResV1 {}

export interface IGetWorkflowCountV1Return extends IGetWorkflowCountsResV1 {}

export interface IGetWorkflowDurationOfWaitingForAuditV1Return
  extends IGetWorkflowDurationOfWaitingForAuditResV1 {}

export interface IGetWorkflowDurationOfWaitingForExecutionV1Return
  extends IGetWorkflowDurationOfWaitingForExecutionResV1 {}

export interface IGetWorkflowCreatedCountEachDayV1Params {
  filter_date_from: string;

  filter_date_to: string;
}

export interface IGetWorkflowCreatedCountEachDayV1Return
  extends IGetWorkflowCreatedCountsEachDayResV1 {}

export interface IGetWorkflowPercentCountedByInstanceTypeV1Return
  extends IGetWorkflowPercentCountedByInstanceTypeResV1 {}

export interface IGetWorkflowPassPercentV1Return
  extends IGetWorkflowPassPercentResV1 {}

export interface IGetWorkflowRejectedPercentGroupByCreatorV1Params {
  limit: number;
}

export interface IGetWorkflowRejectedPercentGroupByCreatorV1Return
  extends IGetWorkflowRejectedPercentGroupByCreatorResV1 {}

export interface IGetWorkflowRejectedPercentGroupByInstanceV1Params {
  limit: number;
}

export interface IGetWorkflowRejectedPercentGroupByInstanceV1Return
  extends IGetWorkflowRejectedPercentGroupByInstanceResV1 {}

export interface IGetWorkflowStatusCountV1Return
  extends IGetWorkflowStatusCountResV1 {}
