import { SyncOutlined } from '@ant-design/icons';
import { Card, Space, Tabs, TabsProps, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWorkflowsV1FilterStatusEnum } from '../../../api/workflow/index.enum';
import { IReduxState } from '../../../store';
import CommonTable, {
  DASHBOARD_COMMON_GET_ORDER_NUMBER,
  genTabPaneTitle,
} from '../CommonTable';
import useDashboardRequest from '../useDashboardRequest';
import { IDBAPanelProps } from './index.type';

enum tabsKeyEnum {
  needMeReview = '1',
  needMeExec = '2',
}

const DBAPanel: React.FC<IDBAPanelProps> = ({
  workflowStatistics,
  getWorkflowStatistics,
  projectName,
}) => {
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const [currentActiveKey, setCurrentActiveKey] = useState<tabsKeyEnum>(
    tabsKeyEnum.needMeReview
  );
  const { t } = useTranslation();

  const handleChangeTabs: TabsProps['onChange'] = (key) => {
    setCurrentActiveKey(key as tabsKeyEnum);
  };

  const needMeReviewResponse = useDashboardRequest(
    {
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_current_step_assignee_user_name: username,
      filter_status: getWorkflowsV1FilterStatusEnum.wait_for_audit,
      project_name: projectName,
    },
    [projectName]
  );

  const needMeExecResponse = useDashboardRequest(
    {
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_current_step_assignee_user_name: username,
      filter_status: getWorkflowsV1FilterStatusEnum.wait_for_execution,
      project_name: projectName,
    },
    [projectName]
  );

  const tableLoading =
    needMeExecResponse.loading || needMeReviewResponse.loading;

  const refreshTable = () => {
    if (tableLoading) {
      return;
    }

    needMeExecResponse.refresh();
    needMeReviewResponse.refresh();
    getWorkflowStatistics();
  };

  const tabItems: TabsProps['items'] = [
    {
      key: tabsKeyEnum.needMeReview,
      label: genTabPaneTitle(
        t('dashboard.pendingOrder.needMeReview'),
        workflowStatistics?.need_me_to_review_workflow_number
      ),
      children: (
        <CommonTable
          tableInfo={{
            loading: needMeReviewResponse.loading,
            data: needMeReviewResponse.data ?? [],
            error: needMeReviewResponse.error,
          }}
        />
      ),
    },
    {
      key: tabsKeyEnum.needMeExec,
      label: genTabPaneTitle(
        t('dashboard.pendingOrder.needMeExec'),
        workflowStatistics?.need_me_to_execute_workflow_number
      ),
      children: (
        <CommonTable
          tableInfo={{
            loading: needMeExecResponse.loading,
            data: needMeExecResponse.data ?? [],
            error: needMeExecResponse.error,
          }}
        />
      ),
    },
  ];

  return (
    <Card className="full-width-element">
      <Tabs
        animated={true}
        size="small"
        type="card"
        onChange={handleChangeTabs}
        activeKey={currentActiveKey}
        tabBarExtraContent={{
          left: (
            <span className="tab-panel-title">
              {t('dashboard.title.pendingOrder')}
            </span>
          ),
          right: (
            <Space>
              <Typography.Text>
                {t('dashboard.tableLimitTips', {
                  number: DASHBOARD_COMMON_GET_ORDER_NUMBER,
                })}
              </Typography.Text>
              <SyncOutlined
                data-testid="refreshTable"
                spin={tableLoading}
                onClick={refreshTable}
              />
            </Space>
          ),
        }}
        items={tabItems}
      />
    </Card>
  );
};

export default DBAPanel;
