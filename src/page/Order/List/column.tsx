import { Tag, Typography } from 'antd';
import { t } from '../../../locale';
import { IWorkflowDetailResV1 } from '../../../api/common';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';

export const renderOrderDesc = (desc?: string, maxWidth = 300) => {
  if (!desc) {
    return '--';
  }
  return (
    <Typography.Paragraph
      style={{ maxWidth }}
      className="margin-bottom-0"
      ellipsis={{
        expandable: false,
        tooltip: (
          <span>{desc.length > 200 ? `${desc.slice(0, 200)}...` : desc}</span>
        ),
        rows: 1,
      }}
    >
      {desc}
    </Typography.Paragraph>
  );
};

export const orderListColumn = (): TableColumn<IWorkflowDetailResV1> => {
  return [
    {
      dataIndex: 'workflow_name',
      title: () => t('order.order.name'),
    },
    {
      dataIndex: 'desc',
      title: () => t('order.order.desc'),
      render: (desc: string) => renderOrderDesc(desc),
    },
    {
      dataIndex: 'create_time',
      title: () => t('order.order.createTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'create_user_name',
      title: () => t('order.order.createUser'),
    },
    {
      dataIndex: 'status',
      title: () => t('order.order.status'),
      render: (status) => {
        return <OrderStatusTag status={status} />;
      },
    },
    {
      dataIndex: 'current_step_assignee_user_name_list',
      title: () => t('order.order.assignee'),
      render: (list: string[]) => {
        return list?.map((v) => {
          return <Tag key={v}>{v}</Tag>;
        });
      },
    },
  ];
};
