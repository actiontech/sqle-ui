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

export default SqlAnalyze;
