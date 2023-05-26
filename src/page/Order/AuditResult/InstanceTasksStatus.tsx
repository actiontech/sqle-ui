import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { GetWorkflowTasksItemV2StatusEnum } from '../../../api/common.enum';
import { InstanceTasksStatusType } from './index.type';

const statusColor: InstanceTasksStatusType = {
  [GetWorkflowTasksItemV2StatusEnum.wait_for_audit]: {
    color: 'blue',
    label: 'order.status.wait_for_audit',
  },
  [GetWorkflowTasksItemV2StatusEnum.wait_for_execution]: {
    color: 'blue',
    label: 'order.status.wait_for_execution',
  },
  [GetWorkflowTasksItemV2StatusEnum.exec_scheduled]: {
    color: 'pink',
    label: 'order.status.exec_scheduled',
  },
  [GetWorkflowTasksItemV2StatusEnum.exec_succeeded]: {
    color: 'green',
    label: 'order.status.exec_succeeded',
  },
  [GetWorkflowTasksItemV2StatusEnum.executing]: {
    color: 'blue',
    label: 'order.status.executing',
  },
  [GetWorkflowTasksItemV2StatusEnum.exec_failed]: {
    color: 'orange',
    label: 'order.status.exec_failed',
  },
  [GetWorkflowTasksItemV2StatusEnum.manually_executed]: {
    color: 'green',
    label: 'order.status.manually_executed',
  },
  [GetWorkflowTasksItemV2StatusEnum.terminate_failed]: {
    color: 'orange',
    label: 'order.status.terminate_failed',
  },
  [GetWorkflowTasksItemV2StatusEnum.terminate_succeeded]: {
    color: 'green',
    label: 'order.status.terminate_succeeded',
  },
  [GetWorkflowTasksItemV2StatusEnum.terminating]: {
    color: 'blue',
    label: 'order.status.terminating',
  },
  unknown: {
    color: undefined,
    label: 'common.unknownStatus',
  },
};

const InstanceTasksStatus: React.FC<{
  status?: GetWorkflowTasksItemV2StatusEnum;
}> = (props) => {
  const { t } = useTranslation();
  const status = props.status ?? 'unknown';

  return (
    <Tag color={statusColor[status].color}>{t(statusColor[status].label)}</Tag>
  );
};

export default InstanceTasksStatus;
