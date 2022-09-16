import { SQLInputType } from '../../../../Create/index.enum';

export type ModifySqlFormFields = {
  sqlInputType: SQLInputType;
  sql?: string;
  sqlFile?: File[];
};

export type ModifySqlFormProps = {
  updateSqlFormInfo: (taskId: string, values: ModifySqlFormFields) => void;
  currentTaskId: string;
  currentDefaultSqlValue: string;
};
