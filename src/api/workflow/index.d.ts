import {
  IGetWorkflowTemplateResV1,
  IUpdateWorkflowTemplateReqV1,
  IBaseRes,
  IGetWorkflowsResV1,
  ICreateWorkflowReqV1,
  IBatchCancelWorkflowsReqV1,
  IBatchCompleteWorkflowsReqV1,
  IGetWorkflowResV1,
  IUpdateWorkflowReqV1,
  IRejectWorkflowReqV1,
  IGetWorkflowTasksResV1,
  IUpdateWorkflowScheduleReqV1,
  ICreateWorkflowReqV2,
  IBatchCancelWorkflowsReqV2,
  IBatchCompleteWorkflowsReqV2,
  IGetWorkflowResV2,
  IUpdateWorkflowReqV2,
  IRejectWorkflowReqV2,
  IGetWorkflowTasksResV2,
  IUpdateWorkflowScheduleReqV2
} from '../common.d';

import {
  getWorkflowsV1FilterStatusEnum,
  exportWorkflowV1FilterStatusEnum,
  getGlobalWorkflowsV1FilterStatusEnum
} from './index.enum';

export interface IGetWorkflowTemplateV1Params {
  project_name: string;
}

export interface IGetWorkflowTemplateV1Return
  extends IGetWorkflowTemplateResV1 {}

export interface IUpdateWorkflowTemplateV1Params
  extends IUpdateWorkflowTemplateReqV1 {
  project_name: string;
}

export interface IUpdateWorkflowTemplateV1Return extends IBaseRes {}

export interface IGetWorkflowsV1Params {
  filter_subject?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  filter_task_execute_start_time_from?: string;

  filter_task_execute_start_time_to?: string;

  filter_create_user_name?: string;

  filter_status?: getWorkflowsV1FilterStatusEnum;

  filter_current_step_assignee_user_name?: string;

  filter_task_instance_name?: string;

  page_index: number;

  page_size: number;

  project_name: string;
}

export interface IGetWorkflowsV1Return extends IGetWorkflowsResV1 {}

export interface ICreateWorkflowV1Params extends ICreateWorkflowReqV1 {
  project_name: string;
}

export interface ICreateWorkflowV1Return extends IBaseRes {}

export interface IBatchCancelWorkflowsV1Params
  extends IBatchCancelWorkflowsReqV1 {
  project_name: string;
}

export interface IBatchCancelWorkflowsV1Return extends IBaseRes {}

export interface IBatchCompleteWorkflowsV1Params
  extends IBatchCompleteWorkflowsReqV1 {
  project_name: string;
}

export interface IBatchCompleteWorkflowsV1Return extends IBaseRes {}

export interface IExportWorkflowV1Params {
  filter_subject?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  filter_task_execute_start_time_from?: string;

  filter_task_execute_start_time_to?: string;

  filter_create_user_name?: string;

  filter_status?: exportWorkflowV1FilterStatusEnum;

  filter_current_step_assignee_user_name?: string;

  filter_task_instance_name?: string;

  project_name: string;
}

export interface IGetWorkflowV1Params {
  workflow_name: string;

  project_name: string;
}

export interface IGetWorkflowV1Return extends IGetWorkflowResV1 {}

export interface IUpdateWorkflowV1Params extends IUpdateWorkflowReqV1 {
  workflow_name: string;

  project_name: string;
}

export interface IUpdateWorkflowV1Return extends IBaseRes {}

export interface ICancelWorkflowV1Params {
  project_name: string;

  workflow_name: string;
}

export interface ICancelWorkflowV1Return extends IBaseRes {}

export interface IApproveWorkflowV1Params {
  workflow_name: string;

  workflow_step_id: string;

  project_name: string;
}

export interface IApproveWorkflowV1Return extends IBaseRes {}

export interface IRejectWorkflowV1Params extends IRejectWorkflowReqV1 {
  workflow_name: string;

  project_name: string;

  workflow_step_id: string;
}

export interface IRejectWorkflowV1Return extends IBaseRes {}

export interface IGetSummaryOfInstanceTasksV1Params {
  workflow_name: string;

  project_name: string;
}

export interface IGetSummaryOfInstanceTasksV1Return
  extends IGetWorkflowTasksResV1 {}

export interface IExecuteTasksOnWorkflowV1Params {
  workflow_name: string;

  project_name: string;
}

export interface IExecuteTasksOnWorkflowV1Return extends IBaseRes {}

export interface IExecuteOneTaskOnWorkflowV1Params {
  workflow_name: string;

  project_name: string;

  task_id: string;
}

export interface IExecuteOneTaskOnWorkflowV1Return extends IBaseRes {}

export interface IUpdateWorkflowScheduleV1Params
  extends IUpdateWorkflowScheduleReqV1 {
  workflow_name: string;

  task_id: string;

  project_name: string;
}

export interface IUpdateWorkflowScheduleV1Return extends IBaseRes {}

export interface IGetGlobalWorkflowsV1Params {
  filter_subject?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  filter_task_execute_start_time_from?: string;

  filter_task_execute_start_time_to?: string;

  filter_create_user_name?: string;

  filter_status?: getGlobalWorkflowsV1FilterStatusEnum;

  filter_current_step_assignee_user_name?: string;

  filter_task_instance_name?: string;

  page_index: number;

  page_size: number;
}

export interface IGetGlobalWorkflowsV1Return extends IGetWorkflowsResV1 {}

export interface ICreateWorkflowV2Params extends ICreateWorkflowReqV2 {
  project_name: string;
}

export interface ICreateWorkflowV2Return extends IBaseRes {}

export interface IBatchCancelWorkflowsV2Params
  extends IBatchCancelWorkflowsReqV2 {
  project_name: string;
}

export interface IBatchCancelWorkflowsV2Return extends IBaseRes {}

export interface IBatchCompleteWorkflowsV2Params
  extends IBatchCompleteWorkflowsReqV2 {
  project_name: string;
}

export interface IBatchCompleteWorkflowsV2Return extends IBaseRes {}

export interface IGetWorkflowV2Params {
  workflow_id: string;

  project_name: string;
}

export interface IGetWorkflowV2Return extends IGetWorkflowResV2 {}

export interface IUpdateWorkflowV2Params extends IUpdateWorkflowReqV2 {
  workflow_id: string;

  project_name: string;
}

export interface IUpdateWorkflowV2Return extends IBaseRes {}

export interface ICancelWorkflowV2Params {
  project_name: string;

  workflow_id: string;
}

export interface ICancelWorkflowV2Return extends IBaseRes {}

export interface IApproveWorkflowV2Params {
  workflow_id: string;

  workflow_step_id: string;

  project_name: string;
}

export interface IApproveWorkflowV2Return extends IBaseRes {}

export interface IRejectWorkflowV2Params extends IRejectWorkflowReqV2 {
  workflow_id: string;

  project_name: string;

  workflow_step_id: string;
}

export interface IRejectWorkflowV2Return extends IBaseRes {}

export interface IGetSummaryOfInstanceTasksV2Params {
  workflow_id: string;

  project_name: string;
}

export interface IGetSummaryOfInstanceTasksV2Return
  extends IGetWorkflowTasksResV2 {}

export interface IExecuteTasksOnWorkflowV2Params {
  workflow_id: string;

  project_name: string;
}

export interface IExecuteTasksOnWorkflowV2Return extends IBaseRes {}

export interface ITerminateMultipleTaskByWorkflowV1Params {
  workflow_id: string;

  project_name: string;
}

export interface ITerminateMultipleTaskByWorkflowV1Return extends IBaseRes {}

export interface IExecuteOneTaskOnWorkflowV2Params {
  workflow_id: string;

  project_name: string;

  task_id: string;
}

export interface IExecuteOneTaskOnWorkflowV2Return extends IBaseRes {}

export interface IUpdateWorkflowScheduleV2Params
  extends IUpdateWorkflowScheduleReqV2 {
  workflow_id: string;

  task_id: string;

  project_name: string;
}

export interface IUpdateWorkflowScheduleV2Return extends IBaseRes {}

export interface ITerminateSingleTaskByWorkflowV1Params {
  workflow_id: string;

  project_name: string;

  task_id: string;
}

export interface ITerminateSingleTaskByWorkflowV1Return extends IBaseRes {}
