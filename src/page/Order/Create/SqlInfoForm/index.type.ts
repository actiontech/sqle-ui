import { FormInstance } from 'antd';
import { SQLInputType } from '.';

export type SqlInfoFormProps = {
  form: FormInstance<SqlInfoFormFields>;
  submit: (values: SqlInfoFormFields) => Promise<void>;
  updateDirtyData: (dirtyDataStatus: boolean) => void;
  instanceNameChange?: (name: string) => void;
};

export type SqlInfoFormFields = {
  instanceName: string;
  instanceSchema: string;
  sqlInputType: SQLInputType;
  sql: string;
  sqlFile: File[];
  mybatisFile: File[];
};
