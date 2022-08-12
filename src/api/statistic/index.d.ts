import {
  IGetInstancesTypePercentResV1,
  IGetLicenseUsageResV1,
  IGetTaskRejectedPercentGroupByCreatorResV1,
  IGetTaskRejectedPercentGroupByInstanceResV1,
  IGetTaskCountsResV1,
  IGetTaskDurationOfWaitingForAuditResV1,
  IGetTaskDurationOfWaitingForExecutionResV1,
  IGetTaskCreatedCountsEachDayResV1,
  IGetTasksPercentCountedByInstanceTypeResV1,
  IGetTaskPassPercentResV1,
  IGetTaskStatusCountResV1
} from '../common.d';

export interface IGetInstancesTypePercentV1Return
  extends IGetInstancesTypePercentResV1 {}

export interface IGetLicenseUsageV1Return extends IGetLicenseUsageResV1 {}

export interface IGetTaskRejectedPercentGroupByCreatorV1Params {
  limit: number;
}

export interface IGetTaskRejectedPercentGroupByCreatorV1Return
  extends IGetTaskRejectedPercentGroupByCreatorResV1 {}

export interface IGetTaskRejectedPercentGroupByInstanceV1Params {
  limit: number;
}

export interface IGetTaskRejectedPercentGroupByInstanceV1Return
  extends IGetTaskRejectedPercentGroupByInstanceResV1 {}

export interface IGetTaskCountV1Return extends IGetTaskCountsResV1 {}

export interface IGetTaskDurationOfWaitingForAuditV1Return
  extends IGetTaskDurationOfWaitingForAuditResV1 {}

export interface IGetTaskDurationOfWaitingForExecutionV1Return
  extends IGetTaskDurationOfWaitingForExecutionResV1 {}

export interface IGetTaskCreatedCountEachDayV1Params {
  filter_date_from: string;

  filter_date_to: string;
}

export interface IGetTaskCreatedCountEachDayV1Return
  extends IGetTaskCreatedCountsEachDayResV1 {}

export interface IGetTasksPercentCountedByInstanceTypeV1Return
  extends IGetTasksPercentCountedByInstanceTypeResV1 {}

export interface IGetTaskPassPercentV1Return extends IGetTaskPassPercentResV1 {}

export interface IGetTaskStatusCountV1Return extends IGetTaskStatusCountResV1 {}
