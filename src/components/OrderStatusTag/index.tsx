import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { WorkflowResV1StatusEnum } from '../../api/common.enum';
import { OrderStatus } from './index.type';

const statusColor: OrderStatus = {
  [WorkflowResV1StatusEnum.canceled]: {
    color: 'red',
    label: 'order.status.canceled',
  },
  [WorkflowResV1StatusEnum.finished]: {
    color: 'green',
    label: 'order.status.finished',
  },
  [WorkflowResV1StatusEnum.on_process]: {
    color: 'blue',
    label: 'order.status.process',
  },
  [WorkflowResV1StatusEnum.rejected]: {
    color: 'orange',
    label: 'order.status.reject',
  },
  unknown: {
    color: undefined,
    label: 'common.unknownStatus',
  },
};

const OrderStatusTag: React.FC<{
  status?: WorkflowResV1StatusEnum;
}> = (props) => {
  const { t } = useTranslation();

  const status = props.status ?? 'unknown';

  return (
    <Tag color={statusColor[status].color}>{t(statusColor[status].label)}</Tag>
  );
};

export default OrderStatusTag;
