import { IGetWorkflowListV1Params } from '../../../api/workflow/index.d';

export type OrderListProps = {
  requestParams?: Omit<IGetWorkflowListV1Params, 'page_index' | 'page_size'>;
};
