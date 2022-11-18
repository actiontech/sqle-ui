import { FormInstance } from 'antd';
import { IAuditPlanResV1 } from '../../../../api/common';
import { PlanFormField } from '../index.type';

export type DataSourceProps = {
  form: FormInstance<PlanFormField>;
  dataSource: string;
  defaultValue?: IAuditPlanResV1;
  dbTypeChange?: (dbType: string) => void;
  dataSourceChange?: (dataSource: string) => void;
  projectName: string;
};

export { default as DataSource } from './DataSource';
