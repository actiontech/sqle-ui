import { FormInstance } from 'antd';
import { IRuleTemplateDetailResV1 } from '../../../../api/common';

export type RuleTemplateBaseInfoFields = {
  templateName: string;
  templateDesc?: string;
  instances?: string[];
  db_type: string;
};

export type RuleTemplateBaseInfoFormProps = {
  form: FormInstance<RuleTemplateBaseInfoFields>;
  defaultData?: IRuleTemplateDetailResV1;
  submit: () => void;
};
