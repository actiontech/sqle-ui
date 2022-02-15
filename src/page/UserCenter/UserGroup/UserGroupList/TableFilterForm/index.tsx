import TableFilterForm from './TableFilterForm';

export type TableFilterFormProps = {
  updateTableFilter: (values: UserGroupListFilter) => void;
};

export type UserGroupListFilter = {
  filter_user_group_name?: string;
};

export default TableFilterForm;
