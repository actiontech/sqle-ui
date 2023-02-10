import OperationRecordList from './List';
import { Moment } from 'moment';

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
};

export default OperationRecordList;
