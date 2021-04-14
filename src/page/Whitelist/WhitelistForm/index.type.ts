import { FormInstance } from 'antd';

export type WhitelistFormFields = {
  desc?: string;
  sql: string;
};

export type WhitelistFormProps = {
  form: FormInstance<WhitelistFormFields>;
};
