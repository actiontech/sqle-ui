/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetProjectListV1Params,
  IGetProjectListV1Return,
  ICreateProjectV1Params,
  ICreateProjectV1Return,
  IDeleteProjectV1Params,
  IDeleteProjectV1Return,
  IUpdateProjectV1Params,
  IUpdateProjectV1Return
} from './index.d';

class ProjectService extends ServiceBase {
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

  public deleteProjectV1(
    params: IDeleteProjectV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_id = paramsData.project_id;
    delete paramsData.project_id;

    return this.delete<IDeleteProjectV1Return>(
      `/v1/projects/${project_id}/`,
      paramsData,
      options
    );
  }

  public updateProjectV1(
    params: IUpdateProjectV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_id = paramsData.project_id;
    delete paramsData.project_id;

    return this.patch<IUpdateProjectV1Return>(
      `/v1/projects/${project_id}/`,
      paramsData,
      options
    );
  }
}

export default new ProjectService();
