import { IAuditPlanResV1 } from '../../../api/common';
import { FormItem } from '../../../components/BackendForm';

export type PlanFormField = {
  name: string;
  databaseName?: string;
  schema?: string;
  dbType: string;
  cron: string;
  auditTaskType: string;
  params?: {
    [key: string]: string | boolean;
  };
  asyncParams?: FormItem[];
};

export type PlanFormProps = {
  submit: (data: PlanFormField) => Promise<void>;
  defaultValue?: IAuditPlanResV1;
};
