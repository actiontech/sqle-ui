import { getProjectTipsV1FunctionalModuleEnum } from './index.enum';

import {
  IGetProjectTipsResV1,
  IGetProjectResV1,
  ICreateProjectReqV1,
  IBaseRes,
  IGetProjectDetailResV1,
  IUpdateProjectReqV1
} from '../common.d';

export interface IGetProjectTipsV1Params {
  functional_module?: getProjectTipsV1FunctionalModuleEnum;
}

export interface IGetProjectTipsV1Return extends IGetProjectTipsResV1 {}

export interface IGetProjectListV1Params {
  page_index: number;

  page_size: number;
}

export interface IGetProjectListV1Return extends IGetProjectResV1 {}

export interface ICreateProjectV1Params extends ICreateProjectReqV1 {}

export interface ICreateProjectV1Return extends IBaseRes {}

export interface IGetProjectDetailV1Params {
  project_name: string;
}

export interface IGetProjectDetailV1Return extends IGetProjectDetailResV1 {}

export interface IDeleteProjectV1Params {
  project_name: string;
}

export interface IDeleteProjectV1Return extends IBaseRes {}

export interface IUpdateProjectV1Params extends IUpdateProjectReqV1 {
  project_name: string;
}

export interface IUpdateProjectV1Return extends IBaseRes {}
