import { Typography } from 'antd';
import i18n from 'i18next';
import { IWorkflowDetailResV1 } from '../../../api/common';
import { getWorkflowListV1FilterCurrentStepTypeEnum } from '../../../api/workflow/index.enum';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { WorkflowStepTypeDictionary } from '../../../hooks/useStaticStatus/index.data';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';

export const orderListColumn = (): TableColumn<IWorkflowDetailResV1> => {
  return [
    {
      dataIndex: 'subject',
      title: () => i18n.t('order.order.name'),
    },
    {
      dataIndex: 'desc',
      title: () => i18n.t('order.order.desc'),
      render: (text) => {
        return (
          <Typography.Text style={{ maxWidth: 300 }} ellipsis={true}>
            {text}
          </Typography.Text>
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
      dataIndex: 'schedule_time',
      title: () => i18n.t('order.order.time'),
      render: (schedule_time) => {
        return formatTime(schedule_time);
      },
    },
    {
      dataIndex: 'current_step_type',
      title: () => i18n.t('order.order.stepType'),
      render: (status: getWorkflowListV1FilterCurrentStepTypeEnum) => {
        return status ? i18n.t(WorkflowStepTypeDictionary[status]) : '';
      },
    },
    {
      dataIndex: 'current_step_assignee_user_name_list',
      title: () => i18n.t('order.order.assignee'),
    },
    {
      dataIndex: 'task_instance_name',
      title: () => i18n.t('order.order.instanceName'),
    },
    {
      dataIndex: 'task_pass_rate',
      title: () => i18n.t('order.order.passRate'),
      render: (passRate) => {
        return passRate !== undefined
          ? `${Number.parseFloat(passRate ?? 0) * 100}%`
          : '--';
      },
    },
    {
      dataIndex: 'task_score',
      title: () => i18n.t('order.order.taskScore'),
    },
  ];
};
