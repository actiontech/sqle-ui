import { ResultStatusType } from 'antd/lib/result';
import { ISQLExplain, ITableMeta } from '../../../api/common';
import SqlAnalyze from './SqlAnalyze';

export type SqlAnalyzeProps = {
  errorMessage: string;
  errorType?: ResultStatusType;
  tableSchemas: ITableMeta[];
  sqlExplain?: ISQLExplain;
  loading?: boolean;
};

export type UseTableSchemaOption = {
  schemaName?: string;
  dataSourceName?: string;
};

export type TableSchemaItem = {
  tableMeta: ITableMeta;
  id: string;
  errorMessage: string;
};

export default SqlAnalyze;
