import { TableColumn } from '../../../types/common.type';
import i18n from 'i18next';
import { formatTime } from '../../../utils/Common';
import { Link } from 'react-router-dom';
import { IWorkflowDetailResV2 } from '../../../api/common';

export const commonColumn: () => TableColumn<IWorkflowDetailResV2> = () => {
  return [
    {
      dataIndex: 'subject',
      title: () => i18n.t('order.order.name'),
      render: (text, record) => {
        return (
          <Link
            to={record.workflow_id ? `/order/${record.workflow_id}` : '/order'}
          >
            {text}
          </Link>
        );
      },
      width: 'auto',
    },
    {
      dataIndex: 'desc',
      title: () => i18n.t('order.order.desc'),
      width: 'auto',
    },
    {
      dataIndex: 'create_time',
      title: () => i18n.t('order.order.createTime'),
      render: (time) => {
        return formatTime(time);
      },
      width: 'auto',
    },
  ];
};
