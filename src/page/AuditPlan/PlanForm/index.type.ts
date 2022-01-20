import { IAuditPlanParamResV1, IAuditPlanResV1 } from '../../../api/common';

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
  asyncParams?: IAuditPlanParamResV1[];
};

export type PlanFormProps = {
  submit: (data: PlanFormField) => Promise<void>;
  defaultValue?: IAuditPlanResV1;
};
