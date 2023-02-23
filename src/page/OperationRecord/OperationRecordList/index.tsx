import OperationRecordList from './List';
import { Moment } from 'moment';
import { FormInstance } from 'antd';

export type OperationRecordListFilterFormFields = {
  filterDate?: [Moment | undefined, Moment | undefined];
  projectName?: string;
  operator?: string;
  operationType?: string;
  operationAction?: string;
};

export type OperationRecordListFilterFormProps = {
  updateOperationRecordListFilter: (
    filter: OperationRecordListFilterFormFields
  ) => void;
  form: FormInstance<OperationRecordListFilterFormFields>;
};

export default OperationRecordList;
