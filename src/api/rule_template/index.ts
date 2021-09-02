/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
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

  public getRuleListV1(
    params: IGetRuleListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetRuleListV1Return>('/v1/rules', paramsData, options);
  }
}

export default new RuleTemplateService();
