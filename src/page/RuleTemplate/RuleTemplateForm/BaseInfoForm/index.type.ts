import { FormInstance } from 'antd';
import { IRuleProjectTemplateDetailResV1 } from '../../../../api/common';

export type RuleTemplateBaseInfoFields = {
  templateName: string;
  instances?: string[];
  templateDesc?: string;
  db_type: string;
};

export type RuleTemplateBaseInfoFormProps = {
  form: FormInstance<RuleTemplateBaseInfoFields>;
  defaultData?: IRuleProjectTemplateDetailResV1;
  submit: () => void;
  projectName: string;
};
