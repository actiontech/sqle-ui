export type PlanListFilterFormFields = {
  filter_audit_plan_db_type?: string;
  fuzzy_search_audit_plan_name?: string;
  filter_audit_plan_type?: string;
  filter_audit_plan_instance_name?: string;
};

export type PlanListFilterFormProps = {
  submit?: (values: PlanListFilterFormFields) => void;
  projectName: string;
};
