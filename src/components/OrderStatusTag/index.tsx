import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { WorkflowRecordResV2StatusEnum } from '../../api/common.enum';
import { OrderStatus } from './index.type';

const statusColor: OrderStatus = {
  [WorkflowRecordResV2StatusEnum.canceled]: {
    color: 'red',
    label: 'order.status.canceled',
  },
  [WorkflowRecordResV2StatusEnum.finished]: {
    color: 'green',
    label: 'order.status.finished',
  },
  [WorkflowRecordResV2StatusEnum.wait_for_audit]: {
    color: 'blue',
    label: 'order.status.wait_for_audit',
  },
  [WorkflowRecordResV2StatusEnum.rejected]: {
    color: 'orange',
    label: 'order.status.reject',
  },
  [WorkflowRecordResV2StatusEnum.wait_for_execution]: {
    color: 'blue',
    label: 'order.status.wait_for_execution',
  },
  [WorkflowRecordResV2StatusEnum.exec_failed]: {
    color: 'orange',
    label: 'order.status.exec_failed',
  },
  [WorkflowRecordResV2StatusEnum.executing]: {
    color: 'blue',
    label: 'order.status.executing',
  },
  unknown: {
    color: undefined,
    label: 'common.unknownStatus',
  },
};

const OrderStatusTag: React.FC<{
  status?: WorkflowRecordResV2StatusEnum;
}> = (props) => {
  const { t } = useTranslation();
  const status = props.status ?? 'unknown';

  return (
    <Tag color={statusColor[status].color}>{t(statusColor[status].label)}</Tag>
  );
};

export default OrderStatusTag;
