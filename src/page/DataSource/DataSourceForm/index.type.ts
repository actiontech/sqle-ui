import { FormInstance } from 'antd';
import { IInstanceResV1 } from '../../../api/common';
import { SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum } from '../../../api/common.enum';
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
  ruleTemplate?: string;
  type?: string;
  params?: BackendFormValues;
  asyncParams?: BackendFormRequestParams[];
  maintenanceTime: MaintenanceTimeValue[];
  needAuditForSqlQuery?: boolean;
  allowQueryWhenLessThanAuditLevel?: SQLQueryConfigReqV1AllowQueryWhenLessThanAuditLevelEnum;
};

export type IDataSourceFormProps = {
  form: FormInstance<DataSourceFormField>;
  defaultData?: IInstanceResV1;
  submit?: (values: DataSourceFormField) => Promise<void>;
  projectName: string;
};
