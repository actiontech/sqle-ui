import { FormInstance } from 'antd';
import { IGetAuditTaskSQLsV1Params } from '../../../../api/task/index.d';

export type FilterFormProps = {
  form: FormInstance<OrderAuditResultFilterFields>;
  submit: () => void;
  reset: () => void;
};

export type OrderAuditResultFilterFields = Omit<
  IGetAuditTaskSQLsV1Params,
  'page_index' | 'page_size' | 'task_id'
>;
