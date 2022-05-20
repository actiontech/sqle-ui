import { FormInstance } from 'antd';
import { IInstanceResV1 } from '../../../api/common';
import {
  BackendFormRequestParams,
  BackendFormValues,
} from '../../../components/BackendForm';
import { MaintenanceTimeValue } from './MaintenanceTimePicker';

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
  params?: BackendFormValues;
  asyncParams?: BackendFormRequestParams[];
  maintenanceTime: MaintenanceTimeValue[];
  maxPreQueryRows: number;
  queryTimeoutSecond?: number;
};

export type IDataSourceFormProps = {
  form: FormInstance<DataSourceFormField>;
  defaultData?: IInstanceResV1;
  submit?: (values: DataSourceFormField) => Promise<void>;
};
