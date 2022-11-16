import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Card, Space, Tabs, TabsProps, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import workflow from '../../../api/workflow';
import { getGlobalWorkflowsV1FilterStatusEnum } from '../../../api/workflow/index.enum';
import { IReduxState } from '../../../store';
import CommonTable, {
  DASHBOARD_COMMON_GET_ORDER_NUMBER,
  genTabPaneTitle,
} from '../CommonTable';
import { IDBAPanelProps } from './index.type';

enum tabsKeyEnum {
  needMeReview = '1',
  needMeExec = '2',
}

const DBAPanel: React.FC<IDBAPanelProps> = ({
  workflowStatistics,
  getWorkflowStatistics,
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

  const needMeReviewResponse = useRequest(
    () => {
      return workflow.getGlobalWorkflowsV1({
        page_index: 1,
        page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
        filter_current_step_assignee_user_name: username,
        filter_status: getGlobalWorkflowsV1FilterStatusEnum.wait_for_audit,
      });
    },
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  const needMeExecResponse = useRequest(
    () => {
      return workflow.getGlobalWorkflowsV1({
        page_index: 1,
        page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
        filter_current_step_assignee_user_name: username,
        filter_status: getGlobalWorkflowsV1FilterStatusEnum.wait_for_execution,
      });
    },
    {
      formatResult(res) {
        return res.data.data;
      },
    }
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
      >
        <Tabs.TabPane
          tab={genTabPaneTitle(
            t('dashboard.pendingOrder.needMeReview'),
            workflowStatistics?.need_me_to_review_workflow_number
          )}
          key={tabsKeyEnum.needMeReview}
        >
          <CommonTable
            tableInfo={{
              loading: needMeReviewResponse.loading,
              data: needMeReviewResponse.data ?? [],
              error: needMeReviewResponse.error,
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={genTabPaneTitle(
            t('dashboard.pendingOrder.needMeExec'),
            workflowStatistics?.need_me_to_execute_workflow_number
          )}
          key={tabsKeyEnum.needMeExec}
        >
          <CommonTable
            tableInfo={{
              loading: needMeExecResponse.loading,
              data: needMeExecResponse.data ?? [],
              error: needMeExecResponse.error,
            }}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default DBAPanel;
