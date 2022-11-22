import { FormInstance } from 'antd';
import { ISQLExplain } from '../../api/common';

export type SqlQueryResultType = {
  sqlQueryId: string;
  hide: boolean;
  errorMessage: string;
};

export interface ISqlInputForm {
  instanceName: string;
  instanceSchema: string;
  sql: string;
  maxPreQueryRows: number;
}

export type UseSQLExecPlanOption = {
  form: FormInstance<ISqlInputForm>;
};

export type SQLExecPlanItem = {
  id: string;
  hide: boolean;
} & ISQLExplain;
