import { ITableMeta } from '../../../api/common';
import { SQLExecPlanItem, SqlQueryResultType } from '../index.type';

export interface ExecuteResultProps {
  queryRes: SqlQueryResultType[];
  updateQueryResult: (res: SqlQueryResultType) => void;
  maxPreQueryRows: number;
  tableSchemas: TableSchemaItem[];
  closeTableSchema: (id: string) => void;
  sqlExecPlan: SQLExecPlanItem[];
  closeExecPlan: (id: string) => void;
}

export type UseTableSchemaOption = {
  schemaName?: string;
  dataSourceName?: string;
};

export type TableSchemaItem = {
  tableMeta: ITableMeta;
  id: string;
  errorMessage: string;
};
