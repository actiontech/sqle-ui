import { FormInstance } from 'antd';
import { WorkflowResV2ModeEnum } from '../../../../api/common.enum';
import { SqlStatementFields } from '../../SqlStatementFormTabs';

export type SqlInfoFormProps = {
  form: FormInstance<SqlInfoFormFields>;
  submit: (
    values: SqlInfoFormFields,
    currentTabIndex: number,
    currentTabKey: string
  ) => Promise<void>;
  updateDirtyData: (dirtyDataStatus: boolean) => void;
  instanceNameChange?: (name: string) => void;
  clearTaskInfos: () => void;
  clearTaskInfoWithKey: (key: string) => void;
};

export type DatabaseInfoFields = {
  instanceName: string;
  instanceSchema: string;
};

export type SqlInfoFormFields = {
  isSameSqlOrder: boolean;
  dataBaseInfo: Array<DatabaseInfoFields>;
  [key: string]: SqlStatementFields | boolean | Array<DatabaseInfoFields>;
};

export type DatabaseInfoProps = Pick<
  SqlInfoFormProps,
  'form' | 'instanceNameChange' | 'clearTaskInfos' | 'clearTaskInfoWithKey'
> & {
  setInstanceNames: React.Dispatch<React.SetStateAction<InstanceNamesType>>;
  setChangeSqlModeDisabled: (disabled: boolean) => void;
  currentSqlMode: WorkflowResV2ModeEnum;
};

export type SqlContentFields = Pick<
  SqlStatementFields,
  'sql' | 'sqlFile' | 'mybatisFile'
>;

export type SameSqlModeProps = {
  submit: (values: SqlContentFields, currentTabIndex: number) => void;
  submitLoading: boolean;
  currentTabIndex: number;
  formValueChange: () => void;
};

export type DifferenceSqlModeProps = Omit<
  SameSqlModeProps,
  'currentTabIndex'
> & {
  instanceNameList: string[];
};

export type InstanceNamesType = Map<number, string>;
export type SchemaListType = Map<number, string[]>;
