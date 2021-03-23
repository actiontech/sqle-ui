import { FormInstance } from 'antd';
import { IRuleResV1 } from '../../../api/common';
import { RuleTemplateBaseInfoFields } from './BaseInfoForm/index.type';

export type RuleTemplateFormProps = {
  form: FormInstance<RuleTemplateBaseInfoFields>;
  isUpdate?: boolean;
  activeRule: IRuleResV1[];
  allRules: IRuleResV1[];
  ruleListLoading: boolean;
  submitLoading: boolean;
  step: number;
  updateActiveRule: (value: IRuleResV1[]) => void;
  baseInfoSubmit: () => void;
  prevStep: () => void;
  submit: () => void;
};
