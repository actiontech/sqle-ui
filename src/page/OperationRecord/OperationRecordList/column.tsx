import { Tag } from 'antd';
import { IOperationRecordList, IOperationUser } from '../../../api/common';
import { OperationRecordListStatusEnum } from '../../../api/common.enum';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';

const OperationRecordListTableHeader =
  (): TableColumn<IOperationRecordList> => {
    return [
      {
        dataIndex: 'operation_time',
        title: () => i18n.t('operationRecord.list.column.operatingTime'),
        render: (time) => {
          return formatTime(time);
        },
      },
      {
        dataIndex: 'operation_user',
        title: () => i18n.t('operationRecord.list.column.operator'),
        render: (userInfo: IOperationUser) => {
          return `${userInfo.user_name ?? ''}  ${userInfo.ip ?? ''}`;
        },
      },
      {
        dataIndex: 'operation_type_name',
        title: () => i18n.t('operationRecord.list.column.operationType'),
      },
      {
        dataIndex: 'operation_content',
        title: () => i18n.t('operationRecord.list.column.operationAction'),
      },
      {
        dataIndex: 'project_name',
        title: () => i18n.t('operationRecord.list.column.projectName'),
        render(name?: string) {
          if (!name) {
            return '--';
          }
          return name;
        },
      },
      {
        dataIndex: 'status',
        title: () => i18n.t('operationRecord.list.column.status'),
        render: (status: OperationRecordListStatusEnum) => {
          if (status === OperationRecordListStatusEnum.success) {
            return <Tag color="green">{i18n.t('common.success')}</Tag>;
          } else if (status === OperationRecordListStatusEnum.fail) {
            return <Tag color="red">{i18n.t('common.fail')}</Tag>;
          }
        },
      },
    ];
  };

export default OperationRecordListTableHeader;
