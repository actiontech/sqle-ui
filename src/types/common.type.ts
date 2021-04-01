import { ColumnGroupType, ColumnType, TableProps } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';

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

export type TableChange<RecordType = unknown> = Required<
  TableProps<RecordType>
>['onChange'];

export type I18nKey = Parameters<ReturnType<typeof useTranslation>['t']>[0];
