/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetProjectTipsV1Return,
  IGetProjectListV1Params,
  IGetProjectListV1Return,
  ICreateProjectV1Params,
  ICreateProjectV1Return,
  IGetProjectDetailV1Params,
  IGetProjectDetailV1Return,
  IDeleteProjectV1Params,
  IDeleteProjectV1Return,
  IUpdateProjectV1Params,
  IUpdateProjectV1Return
} from './index.d';

class ProjectService extends ServiceBase {
  public getProjectTipsV1(options?: AxiosRequestConfig) {
    return this.get<IGetProjectTipsV1Return>(
      '/v1/project_tips',
      undefined,
      options
    );
  }

  public getProjectListV1(
    params: IGetProjectListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetProjectListV1Return>(
      '/v1/projects',
      paramsData,
      options
    );
  }

  public createProjectV1(
    params: ICreateProjectV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateProjectV1Return>(
      '/v1/projects',
      paramsData,
      options
    );
  }

  public getProjectDetailV1(
    params: IGetProjectDetailV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetProjectDetailV1Return>(
      `/v1/projects/${project_name}/`,
      paramsData,
      options
    );
  }

  public deleteProjectV1(
    params: IDeleteProjectV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.delete<IDeleteProjectV1Return>(
      `/v1/projects/${project_name}/`,
      paramsData,
      options
    );
  }

  public updateProjectV1(
    params: IUpdateProjectV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.patch<IUpdateProjectV1Return>(
      `/v1/projects/${project_name}/`,
      paramsData,
      options
    );
  }
}

export default new ProjectService();
