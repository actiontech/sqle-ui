import { FormInstance } from 'antd';
import { IInstanceTaskDetailResV1 } from '../../../api/common';
import SyncTaskForm from './SyncTaskForm';

export type SyncTaskFormFields = {
  source: string;
  version: string;
  url: string;
  instanceType: string;
  ruleTemplateName: string;
  syncInterval: string;
};

export type SyncTaskFormProps = {
  submit: (values: SyncTaskFormFields) => Promise<void>;
  form: FormInstance<SyncTaskFormFields>;
  defaultValue?: IInstanceTaskDetailResV1;
};

export default SyncTaskForm;
