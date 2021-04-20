import { FormInstance } from 'antd';
import { SQLInputType } from '../../../../Create/SqlInfoForm';

export type ModifySqlFormFields = {
  sqlInputType: SQLInputType;
  sql?: string;
  sqlFile?: File[];
};

export type ModifySqlFormProps = {
  form: FormInstance<ModifySqlFormFields>;
};
