import { IAuditPlanResV1 } from '../../../api/common';

export type PlanFormField = {
  name: string;
  databaseName?: string;
  schema?: string;
  dbType: string;
  cron: string;
};

export type PlanFormProps = {
  submit: (data: PlanFormField) => Promise<void>;
  defaultValue?: IAuditPlanResV1;
};
