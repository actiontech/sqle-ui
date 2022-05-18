import { FormInstance } from 'antd';
import { ISqlInputForm, SqlQueryResultType } from '../index.type';

export interface SqlInputProps {
  form: FormInstance<ISqlInputForm>;
  setResultErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setQueryRes: React.Dispatch<React.SetStateAction<SqlQueryResultType[]>>;
}
