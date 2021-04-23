import { FormInstance } from 'antd';
import { IGetWorkflowListV1Params } from '../../../../api/workflow/index.d';

export type OrderListFilterFormFields = Omit<
  IGetWorkflowListV1Params,
  'page_index' | 'page_size'
>;

export type OrderListFilterFormProps = {
  form: FormInstance<OrderListFilterFormFields>;
  submit: () => void;
  reset: () => void;
  collapse?: boolean;
  collapseChange?: (collapse: boolean) => void;
};
