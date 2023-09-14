import { FormInstance } from 'antd';

export type SQLPanelFilterFormFields = {};

export type SQLPanelFilterFormProps = {
  form: FormInstance<SQLPanelFilterFormFields>;
  reset: () => void;
  submit: (values: SQLPanelFilterFormFields) => void;
  projectName: string;
};
