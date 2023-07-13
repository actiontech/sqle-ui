import { FormInstance } from 'antd';
import { ICustomRuleResV1 } from '../../../api/common';
import { CustomRuleResV1LevelEnum } from '../../../api/common.enum';

export type CustomRuleFormBaseInfoFields = {
  annotation: string;
  desc: string;
  dbType: string;
  ruleType: string;
  level?: CustomRuleResV1LevelEnum;
};

export type EditRuleScriptFields = {
  script: string;
};

export type CustomRuleFormProps = {
  form: FormInstance<CustomRuleFormBaseInfoFields>;
  editScriptForm: FormInstance<EditRuleScriptFields>;
  defaultData?: ICustomRuleResV1;
  step: number;
  prevStep: () => void;
  submit: () => void;
  baseInfoSubmit: () => void;
  children: React.ReactNode;
  submitLoading: boolean;
};

export type BaseInfoFormProps = {
  submit: () => void;
} & Pick<CustomRuleFormProps, 'form' | 'defaultData'>;

export type EditRuleScriptProps = {
  form: FormInstance<EditRuleScriptFields>;
} & Pick<
  CustomRuleFormProps,
  'prevStep' | 'submit' | 'submitLoading' | 'defaultData'
>;
