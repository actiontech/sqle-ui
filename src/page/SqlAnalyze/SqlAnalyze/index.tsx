import { ResultStatusType } from 'antd/lib/result';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMeta,
  ITableMetas,
} from '../../../api/common';
import SqlAnalyze from './SqlAnalyze';

export type SqlAnalyzeProps = {
  errorMessage: string;
  errorType?: ResultStatusType;
  tableMetas?: ITableMetas;
  sqlExplain?: ISQLExplain;
  performanceStatistics?: IPerformanceStatistics;
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
