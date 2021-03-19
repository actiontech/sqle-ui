import { ColumnGroupType, ColumnType } from 'antd/lib/table';

export type Dictionary = {
  [key: string]: string | number | boolean | Dictionary;
};

export type ModalStatus = {
  [key: string]: boolean;
};

export type TableColumn<RecordType = unknown, OtherColumnKes = ''> = Array<
  (ColumnGroupType<RecordType> | ColumnType<RecordType>) & {
    dataIndex: keyof RecordType | OtherColumnKes;
  }
>;
