/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetWorkflowTemplateTipsV1Return,
  IGetWorkflowTemplateListV1Params,
  IGetWorkflowTemplateListV1Return,
  ICreateWorkflowTemplateV1Params,
  ICreateWorkflowTemplateV1Return,
  IGetWorkflowTemplateV1Params,
  IGetWorkflowTemplateV1Return,
  IDeleteWorkflowTemplateV1Params,
  IDeleteWorkflowTemplateV1Return,
  IUpdateWorkflowTemplateV1Params,
  IUpdateWorkflowTemplateV1Return,
  IGetWorkflowListV1Params,
  IGetWorkflowListV1Return,
  ICreateWorkflowV1Params,
  ICreateWorkflowV1Return,
  IBatchCancelWorkflowsV1Params,
  IBatchCancelWorkflowsV1Return,
  IGetWorkflowV1Params,
  IGetWorkflowV1Return,
  IUpdateWorkflowV1Params,
  IUpdateWorkflowV1Return,
  ICancelWorkflowV1Params,
  ICancelWorkflowV1Return,
  IUpdateWorkflowScheduleV1Params,
  IUpdateWorkflowScheduleV1Return,
  IApproveWorkflowV1Params,
  IApproveWorkflowV1Return,
  IRejectWorkflowV1Params,
  IRejectWorkflowV1Return,
  IExecuteTaskOnWorkflowV1Params,
  IExecuteTaskOnWorkflowV1Return,
  IGetSummaryOfInstanceTasksV1Params,
  IGetSummaryOfInstanceTasksV1Return,
  IExecuteOneTaskOnWorkflowV1Params,
  IExecuteOneTaskOnWorkflowV1Return,
  IGetWorkflowsV2Params,
  IGetWorkflowsV2Return,
  ICreateWorkflowV2Params,
  ICreateWorkflowV2Return,
  IGetWorkflowV2Params,
  IGetWorkflowV2Return,
  IUpdateWorkflowV2Params,
  IUpdateWorkflowV2Return,
  IExecuteTasksOnWorkflowV2Params,
  IExecuteTasksOnWorkflowV2Return,
  IUpdateWorkflowScheduleV2Params,
  IUpdateWorkflowScheduleV2Return
} from './index.d';

class WorkflowService extends ServiceBase {
  public getWorkflowTemplateTipsV1(options?: AxiosRequestConfig) {
    return this.get<IGetWorkflowTemplateTipsV1Return>(
      '/v1/workflow_template_tips',
      undefined,
      options
    );
  }

  public getWorkflowTemplateListV1(
    params: IGetWorkflowTemplateListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetWorkflowTemplateListV1Return>(
      '/v1/workflow_templates',
      paramsData,
      options
    );
  }

  public createWorkflowTemplateV1(
    params: ICreateWorkflowTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateWorkflowTemplateV1Return>(
      '/v1/workflow_templates',
      paramsData,
      options
    );
  }

  public getWorkflowTemplateV1(
    params: IGetWorkflowTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_template_name = paramsData.workflow_template_name;
    delete paramsData.workflow_template_name;

    return this.get<IGetWorkflowTemplateV1Return>(
      `/v1/workflow_templates/${workflow_template_name}/`,
      paramsData,
      options
    );
  }

  public deleteWorkflowTemplateV1(
    params: IDeleteWorkflowTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_template_name = paramsData.workflow_template_name;
    delete paramsData.workflow_template_name;

    return this.delete<IDeleteWorkflowTemplateV1Return>(
      `/v1/workflow_templates/${workflow_template_name}/`,
      paramsData,
      options
    );
  }

  public updateWorkflowTemplateV1(
    params: IUpdateWorkflowTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_template_name = paramsData.workflow_template_name;
    delete paramsData.workflow_template_name;

    return this.patch<IUpdateWorkflowTemplateV1Return>(
      `/v1/workflow_templates/${workflow_template_name}/`,
      paramsData,
      options
    );
  }

  public getWorkflowListV1(
    params: IGetWorkflowListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetWorkflowListV1Return>(
      '/v1/workflows',
      paramsData,
      options
    );
  }

  public createWorkflowV1(
    params: ICreateWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateWorkflowV1Return>(
      '/v1/workflows',
      paramsData,
      options
    );
  }

  public batchCancelWorkflowsV1(
    params: IBatchCancelWorkflowsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IBatchCancelWorkflowsV1Return>(
      '/v1/workflows/cancel',
      paramsData,
      options
    );
  }

  public getWorkflowV1(
    params: IGetWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.get<IGetWorkflowV1Return>(
      `/v1/workflows/${workflow_id}/`,
      paramsData,
      options
    );
  }

  public updateWorkflowV1(
    params: IUpdateWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.patch<IUpdateWorkflowV1Return>(
      `/v1/workflows/${workflow_id}/`,
      paramsData,
      options
    );
  }

  public cancelWorkflowV1(
    params: ICancelWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.post<ICancelWorkflowV1Return>(
      `/v1/workflows/${workflow_id}/cancel`,
      paramsData,
      options
    );
  }

  public updateWorkflowScheduleV1(
    params: IUpdateWorkflowScheduleV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.put<IUpdateWorkflowScheduleV1Return>(
      `/v1/workflows/${workflow_id}/schedule`,
      paramsData,
      options
    );
  }

  public approveWorkflowV1(
    params: IApproveWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const workflow_step_id = paramsData.workflow_step_id;
    delete paramsData.workflow_step_id;

    return this.post<IApproveWorkflowV1Return>(
      `/v1/workflows/${workflow_id}/steps/${workflow_step_id}/approve`,
      paramsData,
      options
    );
  }

  public rejectWorkflowV1(
    params: IRejectWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const workflow_step_id = paramsData.workflow_step_id;
    delete paramsData.workflow_step_id;

    return this.post<IRejectWorkflowV1Return>(
      `/v1/workflows/${workflow_id}/steps/${workflow_step_id}/reject`,
      paramsData,
      options
    );
  }

  public executeTaskOnWorkflowV1(
    params: IExecuteTaskOnWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.post<IExecuteTaskOnWorkflowV1Return>(
      `/v1/workflows/${workflow_id}/task/execute`,
      paramsData,
      options
    );
  }

  public getSummaryOfInstanceTasksV1(
    params: IGetSummaryOfInstanceTasksV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.get<IGetSummaryOfInstanceTasksV1Return>(
      `/v1/workflows/${workflow_id}/tasks`,
      paramsData,
      options
    );
  }

  public executeOneTaskOnWorkflowV1(
    params: IExecuteOneTaskOnWorkflowV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.post<IExecuteOneTaskOnWorkflowV1Return>(
      `/v1/workflows/${workflow_id}/tasks/${task_id}/execute`,
      paramsData,
      options
    );
  }

  public getWorkflowsV2(
    params: IGetWorkflowsV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetWorkflowsV2Return>(
      '/v2/workflows',
      paramsData,
      options
    );
  }

  public createWorkflowV2(
    params: ICreateWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateWorkflowV2Return>(
      '/v2/workflows',
      paramsData,
      options
    );
  }

  public getWorkflowV2(
    params: IGetWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.get<IGetWorkflowV2Return>(
      `/v2/workflows/${workflow_id}/`,
      paramsData,
      options
    );
  }

  public updateWorkflowV2(
    params: IUpdateWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.patch<IUpdateWorkflowV2Return>(
      `/v2/workflows/${workflow_id}/`,
      paramsData,
      options
    );
  }

  public executeTasksOnWorkflowV2(
    params: IExecuteTasksOnWorkflowV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    return this.post<IExecuteTasksOnWorkflowV2Return>(
      `/v2/workflows/${workflow_id}/tasks/execute`,
      paramsData,
      options
    );
  }

  public updateWorkflowScheduleV2(
    params: IUpdateWorkflowScheduleV2Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const workflow_id = paramsData.workflow_id;
    delete paramsData.workflow_id;

    const task_id = paramsData.task_id;
    delete paramsData.task_id;

    return this.put<IUpdateWorkflowScheduleV2Return>(
      `/v2/workflows/${workflow_id}/tasks/${task_id}/schedule`,
      paramsData,
      options
    );
  }
}

export default new WorkflowService();
