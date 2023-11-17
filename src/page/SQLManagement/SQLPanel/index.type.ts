import { FormInstance } from 'antd';
import {
  GetSqlManageListFilterAuditLevelEnum,
  GetSqlManageListFilterSourceEnum,
  GetSqlManageListFilterStatusEnum,
} from '../../../api/SqlManage/index.enum';

export type SQLPanelFilterFormFields = {
  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: boolean;

  filter_instance_name?: string;

  filter_source?: GetSqlManageListFilterSourceEnum;

  filter_audit_level?: GetSqlManageListFilterAuditLevelEnum;

  filter_last_audit_time?: moment.Moment[];

  filter_status?: GetSqlManageListFilterStatusEnum;

  filter_rule?: string;

  fuzzy_search_endpoint?: string;
};

export type SQLPanelFilterFormProps = {
  form: FormInstance<SQLPanelFilterFormFields>;
  reset: () => void;
  submit: (values: SQLPanelFilterFormFields) => void;
  projectName: string;
};

export type SQLStatisticsProps = {
  optimizedSQLNum: number;
  SQLTotalNum: number;
  problemSQlNum: number;
};
