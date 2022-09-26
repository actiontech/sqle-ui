import { FormInstance } from 'antd';
import { WorkflowResV2ModeEnum } from '../../../../api/common.enum';
import { SQLInputType } from '../index.enum';

export type SqlInfoFormProps = {
  form: FormInstance<SqlInfoFormFields>;
  submit: (values: SqlInfoFormFields, currentTabIndex: number) => Promise<void>;
  updateDirtyData: (dirtyDataStatus: boolean) => void;
  instanceNameChange?: (name: string) => void;
  clearTaskInfos: () => void;
};

export type DatabaseInfoFields = {
  instanceName: string;
  instanceSchema: string;
};

export type SqlInfoFormFields = {
  sqlInputType: SQLInputType;
  sql: string;
  sqlFile: File[];
  mybatisFile: File[];
  isSameSqlOrder: boolean;
  dataBaseInfo: Array<DatabaseInfoFields>;
};

export type DatabaseInfoProps = Pick<
  SqlInfoFormProps,
  'form' | 'instanceNameChange'
> & {
  setInstanceNames: React.Dispatch<React.SetStateAction<InstanceNamesType>>;
  setChangeSqlModeDisabled: (disabled: boolean) => void;
  currentSqlMode: WorkflowResV2ModeEnum;
};

export type SqlContentFields = Pick<
  SqlInfoFormFields,
  'sql' | 'sqlFile' | 'mybatisFile'
>;

export type SameSqlModeProps = {
  submit: (values: SqlContentFields, currentTabIndex: number) => void;
  submitLoading: boolean;
  currentTabIndex: number;
};

export type DifferenceSqlModeProps = Omit<
  SameSqlModeProps,
  'currentTabIndex'
> & {
  instanceNameList: string[];
};

export type InstanceNamesType = Map<number, string>;
export type SchemaListType = Map<number, string[]>;
