import { FormInstance } from 'antd';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '../../../api/sql_audit_record/index.enum';

//todo
export type SQLAuditListFilterFormFields = {
  fuzzy_search_tags: string;
  filter_sql_audit_status: getSQLAuditRecordsV1FilterSqlAuditStatusEnum;
  filter_instance_name: string;
  filter_create_time: moment.Moment[];
};

export type SQLAuditListFilterFormProps = {
  form: FormInstance<SQLAuditListFilterFormFields>;
  submit: () => void;
  projectName: string;
  reset: () => void;
};
export type CustomTagsProps = {
  updateTags: (tags: string[]) => Promise<void>;
  tags: string[];
  projectName: string;
};
