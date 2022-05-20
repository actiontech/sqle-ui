import { IGetSQLResultResDataV1 } from '../../api/common';

export type SqlQueryResultType = {
  sqlQueryId: string;
  resultItem: IGetSQLResultResDataV1;
  hide: boolean;
};

export interface ISqlInputForm {
  instanceName: string;
  instanceSchema: string;
  sql: string;
  maxPreQueryRows: number;
}
