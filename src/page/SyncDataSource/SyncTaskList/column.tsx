import { Divider, Popconfirm, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IInstanceTaskResV1 } from '../../../api/common';
import { InstanceTaskResV1LastSyncStatusEnum } from '../../../api/common.enum';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';

export const SyncTaskListTableColumnFactory: (
  syncAction: (taskId: string) => void,
  deleteAction: (taskId: string) => void
) => TableColumn<IInstanceTaskResV1, 'operator'> = (
  syncAction,
  deleteAction
) => {
  return [
    {
      dataIndex: 'source',
      title: () => i18n.t('syncDataSource.syncTaskList.columns.source'),
    },
    {
      dataIndex: 'version',
      title: () => i18n.t('syncDataSource.syncTaskList.columns.version'),
    },
    {
      dataIndex: 'url',
      title: () => i18n.t('syncDataSource.syncTaskList.columns.url'),
    },
    {
      dataIndex: 'db_type',
      title: () => i18n.t('syncDataSource.syncTaskList.columns.instanceType'),
    },
    {
      dataIndex: 'last_sync_status',
      title: () => i18n.t('syncDataSource.syncTaskList.columns.lastSyncResult'),
      render: (status: InstanceTaskResV1LastSyncStatusEnum) => {
        if (status === InstanceTaskResV1LastSyncStatusEnum.success) {
          return <Tag color="green">{i18n.t('common.success')}</Tag>;
        } else if (status === InstanceTaskResV1LastSyncStatusEnum.fail) {
          return <Tag color="red">{i18n.t('common.fail')}</Tag>;
        }
      },
    },
    {
      dataIndex: 'last_sync_success_time',
      title: () =>
        i18n.t('syncDataSource.syncTaskList.columns.lastSyncSuccessTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'operator',
      title: i18n.t('common.operate'),
      width: 160,
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Link to={`/syncDataSource/update/${record.id?.toString()}`}>
              {i18n.t('common.edit')}
            </Link>
            <Typography.Link
              className="pointer"
              onClick={syncAction.bind(null, record.id?.toString() ?? '')}
            >
              {i18n.t('syncDataSource.syncTaskList.columns.sync')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={i18n.t(
                'syncDataSource.syncTaskList.columns.deleteConfirmTitle'
              )}
              placement="topRight"
              okText={i18n.t('common.ok')}
              cancelText={i18n.t('common.cancel')}
              onConfirm={deleteAction.bind(null, record.id?.toString() ?? '')}
            >
              <Typography.Text type="danger" className="pointer">
                {i18n.t('common.delete')}
              </Typography.Text>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};
