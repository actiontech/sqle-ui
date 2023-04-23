import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import sync_instance from '../../../api/sync_instance';
import { ResponseCode } from '../../../data/common';
import { SyncTaskListTableColumnFactory } from './column';
import { Link } from '../../../components/Link';

const SyncTaskList: React.FC = () => {
  const { t } = useTranslation();

  const syncAction = (taskId: string) => {
    const hideLoading = message.loading(
      t('syncDataSource.syncTaskList.syncTaskLoading')
    );
    sync_instance
      .triggerSyncInstanceV1({
        task_id: taskId,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('syncDataSource.syncTaskList.syncTaskSuccessTips'));
          refresh();
        }
      })
      .finally(() => {
        hideLoading();
      });
  };
  const deleteAction = (taskId: string) => {
    const hideLoading = message.loading(
      t('syncDataSource.syncTaskList.deleteTaskLoading')
    );
    sync_instance
      .deleteSyncInstanceTaskV1({
        task_id: taskId,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('syncDataSource.syncTaskList.deleteTaskSuccessTips')
          );
          refresh();
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  const { loading, data, refresh } = useRequest(() =>
    sync_instance
      .GetSyncInstanceTaskList()
      .then((res) => ({ list: res.data?.data ?? [] }))
  );

  return (
    <Card
      title={
        <Space>
          {t('syncDataSource.syncTaskList.title')}
          <Button onClick={refresh} data-testid="refreshTable">
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <Button type="primary" key="addSyncTask">
          <Link to="syncDataSource/create">
            {t('syncDataSource.syncTaskList.addSyncTask')}
          </Link>
        </Button>,
      ]}
    >
      <Table
        rowKey="id"
        dataSource={data?.list ?? []}
        loading={loading}
        pagination={false}
        columns={SyncTaskListTableColumnFactory(syncAction, deleteAction)}
      />
    </Card>
  );
};

export default SyncTaskList;
