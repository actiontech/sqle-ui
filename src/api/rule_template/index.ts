/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetCustomRulesV1Params,
  IGetCustomRulesV1Return,
  ICreateCustomRuleV1Params,
  ICreateCustomRuleV1Return,
  IGetRuleTypeByDBTypeV1Params,
  IGetRuleTypeByDBTypeV1Return,
  IGetCustomRuleV1Params,
  IGetCustomRuleV1Return,
  IDeleteCustomRuleV1Params,
  IDeleteCustomRuleV1Return,
  IUpdateCustomRuleV1Params,
  IUpdateCustomRuleV1Return,
  IGetProjectRuleTemplateTipsV1Params,
  IGetProjectRuleTemplateTipsV1Return,
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
  IExportProjectRuleTemplateV1Params,
  IGetRuleKnowledgeV1Params,
  IGetRuleKnowledgeV1Return,
  IUpdateRuleKnowledgeParams,
  IUpdateRuleKnowledgeReturn,
  IGetRuleTemplateTipsV1Params,
  IGetRuleTemplateTipsV1Return,
  IGetRuleTemplateListV1Params,
  IGetRuleTemplateListV1Return,
  ICreateRuleTemplateV1Params,
  ICreateRuleTemplateV1Return,
  IImportProjectRuleTemplateV1Params,
  IImportProjectRuleTemplateV1Return,
  IGetRuleTemplateV1Params,
  IGetRuleTemplateV1Return,
  IDeleteRuleTemplateV1Params,
  IDeleteRuleTemplateV1Return,
  IUpdateRuleTemplateV1Params,
  IUpdateRuleTemplateV1Return,
  ICloneRuleTemplateV1Params,
  ICloneRuleTemplateV1Return,
  IExportRuleTemplateV1Params,
  IGetRuleListV1Params,
  IGetRuleListV1Return
} from './index.d';

class RuleTemplateService extends ServiceBase {
  public getCustomRulesV1(
    params: IGetCustomRulesV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetCustomRulesV1Return>(
      '/v1/custom_rules',
      paramsData,
      options
    );
  }

  public createCustomRuleV1(
    params: ICreateCustomRuleV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateCustomRuleV1Return>(
      '/v1/custom_rules',
      paramsData,
      options
    );
  }

  public getRuleTypeByDBTypeV1(
    params: IGetRuleTypeByDBTypeV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const db_type = paramsData.db_type;
    delete paramsData.db_type;

    return this.get<IGetRuleTypeByDBTypeV1Return>(
      `/v1/custom_rules/${db_type}/rule_types`,
      paramsData,
      options
    );
  }

  public getCustomRuleV1(
    params: IGetCustomRuleV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_id = paramsData.rule_id;
    delete paramsData.rule_id;

    return this.get<IGetCustomRuleV1Return>(
      `/v1/custom_rules/${rule_id}`,
      paramsData,
      options
    );
  }

  public deleteCustomRuleV1(
    params: IDeleteCustomRuleV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_id = paramsData.rule_id;
    delete paramsData.rule_id;

    return this.delete<IDeleteCustomRuleV1Return>(
      `/v1/custom_rules/${rule_id}`,
      paramsData,
      options
    );
  }

  public updateCustomRuleV1(
    params: IUpdateCustomRuleV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_id = paramsData.rule_id;
    delete paramsData.rule_id;

    return this.patch<IUpdateCustomRuleV1Return>(
      `/v1/custom_rules/${rule_id}`,
      paramsData,
      options
    );
  }

  public getProjectRuleTemplateTipsV1(
    params: IGetProjectRuleTemplateTipsV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    return this.get<IGetProjectRuleTemplateTipsV1Return>(
      `/v1/projects/${project_name}/rule_template_tips`,
      paramsData,
      options
    );
  }

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

    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.get<IGetProjectRuleTemplateV1Return>(
      `/v1/projects/${project_name}/rule_templates/${rule_template_name}/`,
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

    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.delete<IDeleteProjectRuleTemplateV1Return>(
      `/v1/projects/${project_name}/rule_templates/${rule_template_name}/`,
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

    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.patch<IUpdateProjectRuleTemplateV1Return>(
      `/v1/projects/${project_name}/rule_templates/${rule_template_name}/`,
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

    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.post<ICloneProjectRuleTemplateV1Return>(
      `/v1/projects/${project_name}/rule_templates/${rule_template_name}/clone`,
      paramsData,
      options
    );
  }

  public exportProjectRuleTemplateV1(
    params: IExportProjectRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_name = paramsData.project_name;
    delete paramsData.project_name;

    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.get<any>(
      `/v1/projects/${project_name}/rule_templates/${rule_template_name}/export`,
      paramsData,
      options
    );
  }

  public getRuleKnowledgeV1(
    params: IGetRuleKnowledgeV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const db_type = paramsData.db_type;
    delete paramsData.db_type;

    const rule_name = paramsData.rule_name;
    delete paramsData.rule_name;

    return this.get<IGetRuleKnowledgeV1Return>(
      `/v1/rule_knowledge/db_types/${db_type}/rules/${rule_name}/`,
      paramsData,
      options
    );
  }

  public updateRuleKnowledge(
    params: IUpdateRuleKnowledgeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const db_type = paramsData.db_type;
    delete paramsData.db_type;

    const rule_name = paramsData.rule_name;
    delete paramsData.rule_name;

    return this.patch<IUpdateRuleKnowledgeReturn>(
      `/v1/rule_knowledge/db_types/${db_type}/rules/${rule_name}/`,
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

  public importProjectRuleTemplateV1(
    params: IImportProjectRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.rule_template_file != undefined) {
      paramsData.append('rule_template_file', params.rule_template_file as any);
    }

    return this.post<IImportProjectRuleTemplateV1Return>(
      '/v1/rule_templates/parse',
      paramsData,
      config
    );
  }

  public getRuleTemplateV1(
    params: IGetRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.get<IGetRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_name}/`,
      paramsData,
      options
    );
  }

  public deleteRuleTemplateV1(
    params: IDeleteRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.delete<IDeleteRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_name}/`,
      paramsData,
      options
    );
  }

  public updateRuleTemplateV1(
    params: IUpdateRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.patch<IUpdateRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_name}/`,
      paramsData,
      options
    );
  }

  public CloneRuleTemplateV1(
    params: ICloneRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.post<ICloneRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_name}/clone`,
      paramsData,
      options
    );
  }

  public exportRuleTemplateV1(
    params: IExportRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.get<any>(
      `/v1/rule_templates/${rule_template_name}/export`,
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
