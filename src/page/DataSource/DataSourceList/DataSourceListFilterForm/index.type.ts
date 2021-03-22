import { IGetInstanceListV1Params } from '../../../../api/instance/index.d';

export type DataSourceListFilterFields = Omit<
  IGetInstanceListV1Params,
  'page_index' | 'page_size'
>;

export interface DataSourceListFilterFormProps {
  submit: (values: DataSourceListFilterFields) => void;
}
