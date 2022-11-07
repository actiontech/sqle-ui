/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetProjectRuleTemplateListV1Params,
  IGetProjectRuleTemplateListV1Return,
  ICreateProjectRuleTemplateV1Params,
  ICreateProjectRuleTemplateV1Return,
  IGetProjectRuleTemplateV1Params,
  IGetProjectRuleTemplateV1Return,
  IDeleteProjectRuleTemplateV1Params,
  IDeleteProjectRuleTemplateV1Return,
  IUpdateProjectRuleTemplateV1Params,
  IUpdateProjectRuleTemplateV1Return,
  ICloneProjectRuleTemplateV1Params,
  ICloneProjectRuleTemplateV1Return,
  IGetRuleTemplateTipsV1Params,
  IGetRuleTemplateTipsV1Return,
  IGetRuleTemplateListV1Params,
  IGetRuleTemplateListV1Return,
  ICreateRuleTemplateV1Params,
  ICreateRuleTemplateV1Return,
  IGetRuleTemplateV1Params,
  IGetRuleTemplateV1Return,
  IDeleteRuleTemplateV1Params,
  IDeleteRuleTemplateV1Return,
  IUpdateRuleTemplateV1Params,
  IUpdateRuleTemplateV1Return,
  ICloneRuleTemplateV1Params,
  ICloneRuleTemplateV1Return,
  IGetRuleListV1Params,
  IGetRuleListV1Return
} from './index.d';

class RuleTemplateService extends ServiceBase {
  public getProjectRuleTemplateListV1(
    params: IGetProjectRuleTemplateListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetProjectRuleTemplateListV1Return>(
      `/v1/projects/${project_name}/rule_templates`,
      paramsData,
      options
    );
  }

  public createProjectRuleTemplateV1(
    params: ICreateProjectRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.post<ICreateProjectRuleTemplateV1Return>(
      `/v1/projects/${project_name}/rule_templates`,
      paramsData,
      options
    );
  }

  public getProjectRuleTemplateV1(
    params: IGetProjectRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const rule_template_id = paramsData.rule_template_id;
    delete paramsData.rule_template_id;

    return this.get<IGetProjectRuleTemplateV1Return>(
      `/v1/projects/${project_name}/rule_templates/${rule_template_id}/`,
      paramsData,
      options
    );
  }

  public deleteProjectRuleTemplateV1(
    params: IDeleteProjectRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const rule_template_id = paramsData.rule_template_id;
    delete paramsData.rule_template_id;

    return this.delete<IDeleteProjectRuleTemplateV1Return>(
      `/v1/projects/${project_name}/rule_templates/${rule_template_id}/`,
      paramsData,
      options
    );
  }

  public updateProjectRuleTemplateV1(
    params: IUpdateProjectRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const rule_template_id = paramsData.rule_template_id;
    delete paramsData.rule_template_id;

    return this.patch<IUpdateProjectRuleTemplateV1Return>(
      `/v1/projects/${project_name}/rule_templates/${rule_template_id}/`,
      paramsData,
      options
    );
  }

  public cloneProjectRuleTemplateV1(
    params: ICloneProjectRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const rule_template_id = paramsData.rule_template_id;
    delete paramsData.rule_template_id;

    return this.post<ICloneProjectRuleTemplateV1Return>(
      `/v1/projects/${project_name}/rule_templates/${rule_template_id}/clone`,
      paramsData,
      options
    );
  }

  public getRuleTemplateTipsV1(
    params: IGetRuleTemplateTipsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetRuleTemplateTipsV1Return>(
      '/v1/rule_template_tips',
      paramsData,
      options
    );
  }

  public getRuleTemplateListV1(
    params: IGetRuleTemplateListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetRuleTemplateListV1Return>(
      '/v1/rule_templates',
      paramsData,
      options
    );
  }

  public createRuleTemplateV1(
    params: ICreateRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateRuleTemplateV1Return>(
      '/v1/rule_templates',
      paramsData,
      options
    );
  }

  public getRuleTemplateV1(
    params: IGetRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_id = paramsData.rule_template_id;
    delete paramsData.rule_template_id;

    return this.get<IGetRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_id}/`,
      paramsData,
      options
    );
  }

  public deleteRuleTemplateV1(
    params: IDeleteRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_id = paramsData.rule_template_id;
    delete paramsData.rule_template_id;

    return this.delete<IDeleteRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_id}/`,
      paramsData,
      options
    );
  }

  public updateRuleTemplateV1(
    params: IUpdateRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_id = paramsData.rule_template_id;
    delete paramsData.rule_template_id;

    return this.patch<IUpdateRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_id}/`,
      paramsData,
      options
    );
  }

  public CloneRuleTemplateV1(
    params: ICloneRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_id = paramsData.rule_template_id;
    delete paramsData.rule_template_id;

    return this.post<ICloneRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_id}/clone`,
      paramsData,
      options
    );
  }

  public getRuleListV1(
    params: IGetRuleListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetRuleListV1Return>('/v1/rules', paramsData, options);
  }
}

export default new RuleTemplateService();
