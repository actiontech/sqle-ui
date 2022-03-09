import {
  IGetInstanceAdditionalMetasResV1,
  IGetInstanceConnectableReqV1,
  IGetInstanceConnectableResV1,
  IGetInstanceTipsResV1,
  IGetInstancesResV1,
  ICreateInstanceReqV1,
  IBaseRes,
  IGetInstanceResV1,
  IUpdateInstanceReqV1,
  IGetRulesResV1,
  IGetInstanceSchemaResV1,
  IGetInstanceWorkflowTemplateResV1
} from '../common.d';

export interface IGetInstanceAdditionalMetasReturn
  extends IGetInstanceAdditionalMetasResV1 {}

export interface ICheckInstanceIsConnectableV1Params
  extends IGetInstanceConnectableReqV1 {}

export interface ICheckInstanceIsConnectableV1Return
  extends IGetInstanceConnectableResV1 {}

export interface IGetInstanceTipListV1Params {
  filter_db_type?: string;
}

export interface IGetInstanceTipListV1Return extends IGetInstanceTipsResV1 {}

export interface IGetInstanceListV1Params {
  filter_instance_name?: string;

  filter_db_type?: string;

  filter_db_host?: string;

  filter_db_port?: string;

  filter_db_user?: string;

  filter_workflow_template_name?: string;

  filter_rule_template_name?: string;

  filter_role_name?: string;

  page_index?: number;

  page_size?: number;
}

export interface IGetInstanceListV1Return extends IGetInstancesResV1 {}

export interface ICreateInstanceV1Params extends ICreateInstanceReqV1 {}

export interface ICreateInstanceV1Return extends IBaseRes {}

export interface IGetInstanceV1Params {
  instance_name: string;
}

export interface IGetInstanceV1Return extends IGetInstanceResV1 {}

export interface IDeleteInstanceV1Params {
  instance_name: string;
}

export interface IDeleteInstanceV1Return extends IBaseRes {}

export interface IUpdateInstanceV1Params extends IUpdateInstanceReqV1 {
  instance_name: string;
}

export interface IUpdateInstanceV1Return extends IBaseRes {}

export interface ICheckInstanceIsConnectableByNameV1Params {
  instance_name: string;
}

export interface ICheckInstanceIsConnectableByNameV1Return
  extends IGetInstanceConnectableResV1 {}

export interface IGetInstanceRuleListV1Params {
  instance_name: string;
}

export interface IGetInstanceRuleListV1Return extends IGetRulesResV1 {}

export interface IGetInstanceSchemasV1Params {
  instance_name: string;
}

export interface IGetInstanceSchemasV1Return extends IGetInstanceSchemaResV1 {}

export interface IGetInstanceWorkflowTemplateV1Params {
  instance_name: string;
}

export interface IGetInstanceWorkflowTemplateV1Return
  extends IGetInstanceWorkflowTemplateResV1 {}
