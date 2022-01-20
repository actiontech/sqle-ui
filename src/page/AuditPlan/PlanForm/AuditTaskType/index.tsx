import { FormInstance } from 'antd';
import { IAuditPlanParamResV1, IAuditPlanResV1 } from '../../../../api/common';

export type AuditTaskTypeProps = {
  dbType: string;
  form: FormInstance;
  defaultValue?: IAuditPlanResV1;
  updateCurrentTypeParams?: (params?: IAuditPlanParamResV1[]) => void;
};

export { default as AuditTaskType } from './AuditTaskType';
