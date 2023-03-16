import { IGetDashboardResV1, IGetDashboardProjectTipsResV1 } from '../common.d';

export interface IGetDashboardV1Params {
  filter_project_name?: string;
}

export interface IGetDashboardV1Return extends IGetDashboardResV1 {}

export interface IGetDashboardProjectTipsV1Return
  extends IGetDashboardProjectTipsResV1 {}
