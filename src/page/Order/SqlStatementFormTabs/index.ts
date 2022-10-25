import { FormInstance } from 'antd';
import SqlStatementForm from './SqlStatementForm';
import SqlStatementFormTabs from './SqlStatementFormTabs';

export { SqlStatementForm, SqlStatementFormTabs };

export interface SqlStatementFormProps {
  form: FormInstance;
  isClearFormWhenChangeSqlType?: boolean;
  sqlStatement?: string;
  fieldName?: string;
  hideUpdateMybatisFile?: boolean;
}
export interface SqlStatementFormTabsProps
  extends Omit<SqlStatementFormProps, 'sqlStatement'> {
  sqlStatementInfo: Array<SqlStatementInfoType>;
  tabsChangeHandle?: (tab: string) => void;
}

export type SqlStatementFormTabsRefType = {
  activeKey: string;
  activeIndex: number;
  tabsChangeHandle: (tab: string) => void;
};

export type SqlStatementInfoType = {
  key: string;
  instanceName: string;
  sql?: string;
};

export enum SQLInputType {
  manualInput,
  uploadFile,
  uploadMybatisFile,
}

export type SqlStatementFields = {
  sqlInputType: SQLInputType;
  sql: string;
  sqlFile: File[];
  mybatisFile: File[];
};
