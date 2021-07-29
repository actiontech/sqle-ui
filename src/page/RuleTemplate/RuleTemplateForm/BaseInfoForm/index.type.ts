import { FormInstance } from 'antd';

export type RuleTemplateBaseInfoFields = {
  templateName: string;
  templateDesc?: string;
  instances?: string[];
  db_type: string;
};

export type RuleTemplateBaseInfoFormProps = {
  form: FormInstance<RuleTemplateBaseInfoFields>;
  isUpdate?: boolean;
  submit: () => void;
};
