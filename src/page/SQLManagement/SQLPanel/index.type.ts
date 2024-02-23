import { FormInstance } from 'antd';
import {
  GetSqlManageListV2FilterSourceEnum,
  GetSqlManageListV2FilterAuditLevelEnum,
  GetSqlManageListV2FilterStatusEnum,
} from '../../../api/SqlManage/index.enum';

export type SQLPanelFilterFormFields = {
  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: boolean;

  filter_instance_name?: string;

  filter_source?: GetSqlManageListV2FilterSourceEnum;

  filter_audit_level?: GetSqlManageListV2FilterAuditLevelEnum;

  filter_last_audit_time?: moment.Moment[];

  filter_status?: GetSqlManageListV2FilterStatusEnum;

  filter_rule?: string;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  fuzzy_search_audit_plan_name?: string;
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
