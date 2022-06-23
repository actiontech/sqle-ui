import { FormInstance } from 'antd';
import { ISqlInputForm } from '../index.type';

export interface SqlInputProps {
  form: FormInstance<ISqlInputForm>;
  dataSourceName: string;
  maxQueryRows?: number;
  updateDataSourceName: (name: string) => void;
  updateSchemaName: (name: string) => void;
  submitForm: (values: ISqlInputForm) => Promise<void>;
  getSQLExecPlan: () => Promise<void>;
}
