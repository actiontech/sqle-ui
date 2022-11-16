import { Tag, Tooltip, Typography } from 'antd';
import i18n from 'i18next';
import { IWorkflowDetailResV1 } from '../../../api/common';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';

export const orderListColumn = (): TableColumn<IWorkflowDetailResV1> => {
  return [
    {
      dataIndex: 'workflow_name',
      title: () => i18n.t('order.order.name'),
    },
    {
      dataIndex: 'desc',
      title: () => i18n.t('order.order.desc'),
      render: (text) => {
        return (
          <Tooltip overlay={text}>
            <Typography.Text style={{ maxWidth: 300 }} ellipsis={true}>
              {text}
            </Typography.Text>
          </Tooltip>
        );
      },
    },
    {
      dataIndex: 'create_time',
      title: () => i18n.t('order.order.createTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'create_user_name',
      title: () => i18n.t('order.order.createUser'),
    },
    {
      dataIndex: 'status',
      title: () => i18n.t('order.order.status'),
      render: (status) => {
        return <OrderStatusTag status={status} />;
      },
    },
    {
      dataIndex: 'current_step_assignee_user_name_list',
      title: () => i18n.t('order.order.assignee'),
      render: (list: string[]) => {
        return list?.map((v) => {
          return <Tag key={v}>{v}</Tag>;
        });
      },
    },
  ];
};
