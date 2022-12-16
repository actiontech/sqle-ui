import { FormInstance } from 'antd';
import { IRuleTemplateDetailResV1 } from '../../../../api/common';
import { RuleTemplateFormProps } from '../index.type';

export type RuleTemplateBaseInfoFields = {
  templateName: string;
  templateDesc?: string;
  db_type: string;
};

export type RuleTemplateBaseInfoFormProps = {
  form: FormInstance<RuleTemplateBaseInfoFields>;
  defaultData?: IRuleTemplateDetailResV1;
  submit: () => void;
  mode: RuleTemplateFormProps['mode'];
};
