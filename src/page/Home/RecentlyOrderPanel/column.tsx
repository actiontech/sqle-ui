import i18n from 'i18next';
import { Link } from 'react-router-dom';
import { IWorkflowDetailResV1 } from '../../../api/common';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';

export const customColumn: () => TableColumn<IWorkflowDetailResV1> = () => {
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
    },
    {
      dataIndex: 'status',
      title: () => i18n.t('order.order.status'),
      render: (status) => {
        return <OrderStatusTag status={status} />;
      },
      width: 'auto',
    },
  ];
};
