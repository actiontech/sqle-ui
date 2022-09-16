import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { GetWorkflowTasksItemV1StatusEnum } from '../../../api/common.enum';
import { InstanceTasksStatusType } from './index.type';

const statusColor: InstanceTasksStatusType = {
  [GetWorkflowTasksItemV1StatusEnum.wait_for_audit]: {
    color: 'blue',
    label: 'order.status.wait_for_audit',
  },
  [GetWorkflowTasksItemV1StatusEnum.wait_for_execution]: {
    color: 'blue',
    label: 'order.status.wait_for_execution',
  },
  [GetWorkflowTasksItemV1StatusEnum.exec_scheduled]: {
    color: 'pink',
    label: 'order.status.exec_scheduled',
  },
  [GetWorkflowTasksItemV1StatusEnum.exec_succeeded]: {
    color: 'green',
    label: 'order.status.exec_succeeded',
  },
  [GetWorkflowTasksItemV1StatusEnum.executing]: {
    color: 'blue',
    label: 'order.status.executing',
  },
  [GetWorkflowTasksItemV1StatusEnum.exec_failed]: {
    color: 'orange',
    label: 'order.status.exec_failed',
  },
  unknown: {
    color: undefined,
    label: 'common.unknownStatus',
  },
};

const InstanceTasksStatus: React.FC<{
  status?: GetWorkflowTasksItemV1StatusEnum;
}> = (props) => {
  const { t } = useTranslation();
  const status = props.status ?? 'unknown';

  return (
    <Tag color={statusColor[status].color}>{t(statusColor[status].label)}</Tag>
  );
};

export default InstanceTasksStatus;
