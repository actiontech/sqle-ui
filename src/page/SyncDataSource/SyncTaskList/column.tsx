import { Divider, Popconfirm, Space, Tag, Typography } from 'antd';
import { IInstanceTaskResV1 } from '../../../api/common';
import { InstanceTaskResV1LastSyncStatusEnum } from '../../../api/common.enum';
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';
import { Link } from '../../../components/Link';
import DatabaseTypeLogo from '../../../components/DatabaseTypeLogo';

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
      title: () => t('syncDataSource.syncTaskList.columns.source'),
    },
    {
      dataIndex: 'version',
      title: () => t('syncDataSource.syncTaskList.columns.version'),
    },
    {
      dataIndex: 'url',
      title: () => t('syncDataSource.syncTaskList.columns.url'),
    },
    {
      dataIndex: 'db_type',
      title: () => t('syncDataSource.syncTaskList.columns.instanceType'),
      render(type: string) {
        if (!type) {
          return '--';
        }

        return <DatabaseTypeLogo dbType={type} />;
      },
    },
    {
      dataIndex: 'last_sync_status',
      title: () => t('syncDataSource.syncTaskList.columns.lastSyncResult'),
      render: (status: InstanceTaskResV1LastSyncStatusEnum) => {
        if (status === InstanceTaskResV1LastSyncStatusEnum.succeeded) {
          return <Tag color="green">{t('common.success')}</Tag>;
        } else if (status === InstanceTaskResV1LastSyncStatusEnum.failed) {
          return <Tag color="red">{t('common.fail')}</Tag>;
        }
      },
    },
    {
      dataIndex: 'last_sync_success_time',
      title: () => t('syncDataSource.syncTaskList.columns.lastSyncSuccessTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'operator',
      title: t('common.operate'),
      width: 160,
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Link to={`syncDataSource/update/${record.id?.toString()}`}>
              {t('common.edit')}
            </Link>
            <Typography.Link
              className="pointer"
              onClick={syncAction.bind(null, record.id?.toString() ?? '')}
            >
              {t('syncDataSource.syncTaskList.columns.sync')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={t(
                'syncDataSource.syncTaskList.columns.deleteConfirmTitle'
              )}
              placement="topRight"
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
              onConfirm={deleteAction.bind(null, record.id?.toString() ?? '')}
            >
              <Typography.Text type="danger" className="pointer">
                {t('common.delete')}
              </Typography.Text>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};
