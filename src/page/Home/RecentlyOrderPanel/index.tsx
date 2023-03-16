import { SyncOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IGetWorkflowsV1Params } from '../../../api/workflow/index.d';
import { translateTimeForRequest } from '../../../utils/Common';
import CommonTable from '../CommonTable';
import useDashboardRequest from '../useDashboardRequest';
import { customColumn } from './column';
import { IRecentlyOrderPanelProps } from './index.type';

const RecentlyOrderPanel: React.FC<IRecentlyOrderPanelProps> = ({
  projectName,
}) => {
  const { t } = useTranslation();

  const getParams = useCallback((): IGetWorkflowsV1Params => {
    const endTime = moment();
    const startTime = cloneDeep(endTime).subtract(1, 'day');

    return {
      page_index: 1,
      page_size: 1000,
      filter_task_execute_start_time_from: translateTimeForRequest(startTime),
      filter_task_execute_start_time_to: translateTimeForRequest(endTime),
      project_name: projectName,
    };
  }, [projectName]);

  const recentlyOrderResponse = useDashboardRequest(getParams(), [projectName]);

  const refreshTable = () => {
    if (recentlyOrderResponse?.loading) {
      return;
    }

    if (typeof recentlyOrderResponse?.refresh === 'function') {
      recentlyOrderResponse.refresh();
    }
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
