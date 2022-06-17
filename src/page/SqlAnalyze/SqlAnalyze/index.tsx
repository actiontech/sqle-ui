import { ISQLExplain, ITableMeta } from '../../../api/common';
import SqlAnalyze from './SqlAnalyze';

export type SqlAnalyzeProps = {
  errorMessage: string;
  tableSchemas: ITableMeta[];
  sqlExplain?: ISQLExplain;
  loading?: boolean;
};

export default SqlAnalyze;
