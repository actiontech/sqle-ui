import { FormInstance } from 'antd';
import { IGetSQLAuditRecordsV1Params } from '../../../api/sql_audit_record/index.d';

export type SQLAuditListFilterFormFields = Omit<
  IGetSQLAuditRecordsV1Params,
  | 'page_index'
  | 'page_size'
  | 'project_name'
  | 'filter_create_time_to'
  | 'filter_create_time_from'
> & {
  filter_create_time?: moment.Moment[];
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
