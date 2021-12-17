import {
  IGetWorkflowTemplateTipResV1,
  IGetWorkflowTemplatesResV1,
  ICreateWorkflowTemplateReqV1,
  IBaseRes,
  IGetWorkflowTemplateResV1,
  IUpdateWorkflowTemplateReqV1,
  IGetWorkflowsResV1,
  ICreateWorkflowReqV1,
  IBatchCancelWorkflowsReqV1,
  IGetWorkflowResV1,
  IUpdateWorkflowReqV1,
  IUpdateWorkflowScheduleV1,
  IRejectWorkflowReqV1
} from '../common.d';

import {
  getWorkflowListV1FilterCurrentStepTypeEnum,
  getWorkflowListV1FilterStatusEnum
} from './index.enum';

export interface IGetWorkflowTemplateTipsV1Return
  extends IGetWorkflowTemplateTipResV1 {}

export interface IGetWorkflowTemplateListV1Params {
  page_index?: number;

  page_size?: number;
}

export interface IGetWorkflowTemplateListV1Return
  extends IGetWorkflowTemplatesResV1 {}

export interface ICreateWorkflowTemplateV1Params
  extends ICreateWorkflowTemplateReqV1 {}

export interface ICreateWorkflowTemplateV1Return extends IBaseRes {}

export interface IGetWorkflowTemplateV1Params {
  workflow_template_name: string;
}

export interface IGetWorkflowTemplateV1Return
  extends IGetWorkflowTemplateResV1 {}

export interface IDeleteWorkflowTemplateV1Params {
  workflow_template_name: string;
}

export interface IDeleteWorkflowTemplateV1Return extends IBaseRes {}

export interface IUpdateWorkflowTemplateV1Params
  extends IUpdateWorkflowTemplateReqV1 {
  workflow_template_name: string;
}

export interface IUpdateWorkflowTemplateV1Return extends IBaseRes {}

export interface IGetWorkflowListV1Params {
  filter_subject?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  filter_create_user_name?: string;

  filter_current_step_type?: getWorkflowListV1FilterCurrentStepTypeEnum;

  filter_status?: getWorkflowListV1FilterStatusEnum;

  filter_current_step_assignee_user_name?: string;

  filter_task_instance_name?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetWorkflowListV1Return extends IGetWorkflowsResV1 {}

export interface ICreateWorkflowV1Params extends ICreateWorkflowReqV1 {}

export interface ICreateWorkflowV1Return extends IBaseRes {}

export interface IBatchCancelWorkflowsV1Params
  extends IBatchCancelWorkflowsReqV1 {}

export interface IBatchCancelWorkflowsV1Return extends IBaseRes {}

export interface IGetWorkflowV1Params {
  workflow_id: number;
}

export interface IGetWorkflowV1Return extends IGetWorkflowResV1 {}

export interface IUpdateWorkflowV1Params extends IUpdateWorkflowReqV1 {
  workflow_id: string;
}

export interface IUpdateWorkflowV1Return extends IBaseRes {}

export interface ICancelWorkflowV1Params {
  workflow_id: string;
}

export interface ICancelWorkflowV1Return extends IBaseRes {}

export interface IUpdateWorkflowScheduleV1Params
  extends IUpdateWorkflowScheduleV1 {
  workflow_id: string;
}

export interface IUpdateWorkflowScheduleV1Return extends IBaseRes {}

export interface IApproveWorkflowV1Params {
  workflow_id: string;

  workflow_step_id: string;
}

export interface IApproveWorkflowV1Return extends IBaseRes {}

export interface IRejectWorkflowV1Params extends IRejectWorkflowReqV1 {
  workflow_id: string;

  workflow_step_id: string;
}

export interface IRejectWorkflowV1Return extends IBaseRes {}

export interface IExecuteTaskOnWorkflowV1Params {
  workflow_id: string;
}

export interface IExecuteTaskOnWorkflowV1Return extends IBaseRes {}
