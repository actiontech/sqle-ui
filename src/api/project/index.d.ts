import {
  IGetProjectResV1,
  ICreateProjectReqV1,
  IBaseRes,
  IUpdateProjectReqV1
} from '../common.d';

export interface IGetProjectListV1Params {
  page_index?: number;

  page_size?: number;
}

export interface IGetProjectListV1Return extends IGetProjectResV1 {}

export interface ICreateProjectV1Params extends ICreateProjectReqV1 {}

export interface ICreateProjectV1Return extends IBaseRes {}

export interface IDeleteProjectV1Params {
  project_id: number;
}

export interface IDeleteProjectV1Return extends IBaseRes {}

export interface IUpdateProjectV1Params extends IUpdateProjectReqV1 {
  project_id: number;
}

export interface IUpdateProjectV1Return extends IBaseRes {}
