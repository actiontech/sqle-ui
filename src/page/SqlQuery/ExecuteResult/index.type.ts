import { SqlQueryResultType } from '../index.type';

export interface ExecuteResultProps {
  resultErrorMessage: string;
  queryRes: SqlQueryResultType[];
  setQueryRes: React.Dispatch<React.SetStateAction<SqlQueryResultType[]>>;
  maxPreQueryRows: number;
  setResultErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
