import { TableColumn } from '../../../types/common.type';
import i18n from 'i18next';
import { Tooltip, Typography } from 'antd';
import { formatTime } from '../../../utils/Common';
import { Link } from 'react-router-dom';
import { IWorkflowDetailResV1 } from '../../../api/common';

export const commonColumn: () => TableColumn<IWorkflowDetailResV1> = () => {
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
  ];
};
