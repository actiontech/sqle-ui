import { FormInstance } from 'antd';
import { IInstanceResV1 } from '../../../api/common';

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
  defaultData?: IInstanceResV1;
};
