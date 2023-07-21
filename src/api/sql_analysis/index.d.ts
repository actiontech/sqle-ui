import { IDirectGetSQLAnalysisResV1 } from '../common.d';

export interface IDirectGetSQLAnalysisV1Params {
  project_name: string;

  instance_name: string;

  schema_name?: string;

  sql?: string;
}

export interface IDirectGetSQLAnalysisV1Return
  extends IDirectGetSQLAnalysisResV1 {}
