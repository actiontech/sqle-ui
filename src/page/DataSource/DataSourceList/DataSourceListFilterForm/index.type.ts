export type DataSourceListFilterFields = {
  filter_instance_name?: string | undefined;
  filter_db_type?: string | undefined;
  filter_db_host?: string | undefined;
  filter_db_port?: string | undefined;
  filter_rule_template_name?: string | undefined;
};

export interface DataSourceListFilterFormProps {
  submit: (values: DataSourceListFilterFields) => void;
  projectName: string;
}
