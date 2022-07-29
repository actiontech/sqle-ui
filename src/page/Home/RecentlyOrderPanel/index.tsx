import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Space } from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import workflow from '../../../api/workflow';
import { translateTimeForRequest } from '../../../utils/Common';
import { OrderListUrlParamsKey } from '../../Order/List/index.data';
import CommonTable from '../CommonTable';
import { customColumn } from './column';

const RecentlyOrderPanel: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const recentlyOrderResponse = useRequest(
    () => {
      const endTime = moment();
      const startTime = cloneDeep(endTime).subtract(1, 'day');
      return workflow.getWorkflowListV1({
        page_index: 1,
        page_size: 1000,
        filter_task_execute_start_time_from: translateTimeForRequest(startTime),
        filter_task_execute_start_time_to: translateTimeForRequest(endTime),
      });
    },
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  const refreshTable = () => {
    if (recentlyOrderResponse?.loading) {
      return;
    }

    if (typeof recentlyOrderResponse?.refresh === 'function') {
      recentlyOrderResponse.refresh();
    }
  };

  const showAll = () => {
    const endTime = moment();
    const startTime = cloneDeep(endTime).subtract(1, 'day');
    const format = (time: moment.Moment) => {
      return time.format('YYYY-MM-DD HH:mm:ss');
    };
    history.push(
      `/order?${OrderListUrlParamsKey.executeTimeForm}=${format(startTime)}&${
        OrderListUrlParamsKey.executeTimeTo
      }=${format(endTime)}`
    );
  };

  return (
    <Card
      title={
        <Space className="flex-space-between">
          <span>{t('dashboard.title.recentlyOnlineWorkOrder')}</span>
          <div>
            <SyncOutlined
              spin={recentlyOrderResponse?.loading}
              onClick={refreshTable}
              data-testid="refreshTable"
            />
            <Button
              type="link"
              onClick={showAll}
              style={{ padding: 0, marginLeft: 10 }}
            >
              {t('common.more')}
            </Button>
          </div>
        </Space>
      }
    >
      <CommonTable
        customColumn={customColumn}
        tableInfo={{
          loading: recentlyOrderResponse.loading,
          data: recentlyOrderResponse.data ?? [],
          error: recentlyOrderResponse.error,
        }}
      />
    </Card>
  );
};

export default RecentlyOrderPanel;
