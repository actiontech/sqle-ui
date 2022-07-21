import { FormInstance } from 'antd';
import { IGetWorkflowListV1Params } from '../../../../api/workflow/index.d';

export type OrderListFilterFormFields = Omit<
  IGetWorkflowListV1Params,
  | 'page_index'
  | 'page_size'
  | 'filter_create_time_from'
  | 'filter_create_time_to'
  | 'filter_task_execute_start_time_from'
  | 'filter_task_execute_start_time_to'
> & {
  filter_order_createTime?: moment.Moment[];
  filter_order_executeTime?: moment.Moment[];
};

export type OrderListFilterFormProps = {
  form: FormInstance<OrderListFilterFormFields>;
  submit: () => void;
  reset: () => void;
  collapse?: boolean;
  collapseChange?: (collapse: boolean) => void;
};
