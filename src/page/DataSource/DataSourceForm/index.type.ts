import { FormInstance } from 'antd';

export type DataSourceFormField = {
  name: string;
  describe?: string;
  ip: string;
  port: number;
  user: string;
  password: string;
  role?: string[];
  ruleTemplate?: string;
  workflow?: string;
  type?: string;
};

export type IDataSourceFormProps = {
  form: FormInstance<DataSourceFormField>;
  isUpdate?: boolean;
};
