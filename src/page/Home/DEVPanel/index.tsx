import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Tabs, TabsProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import workflow from '../../../api/workflow';
import { getGlobalWorkflowsV1FilterStatusEnum } from '../../../api/workflow/index.enum';
import { IReduxState } from '../../../store';
import { OrderListUrlParamsKey } from '../../Order/List/index.data';
import CommonTable, {
  DASHBOARD_COMMON_GET_ORDER_NUMBER,
  genTabPaneTitle,
} from '../CommonTable';
import { IDEVPanelProps } from './index.type';

enum tabsKeyEnum {
  pendingReviewByMe = '1',
  pendingExecByMe = '2',
  rejectedOrderByMe = '3',
}

const DBAPanel: React.FC<IDEVPanelProps> = ({
  workflowStatistics,
  getWorkflowStatistics,
}) => {
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );

  const history = useHistory();
  const [currentActiveKey, setCurrentActiveKey] = useState<tabsKeyEnum>(
    tabsKeyEnum.pendingReviewByMe
  );
  const { t } = useTranslation();

  const handleChangeTabs: TabsProps['onChange'] = (key) => {
    setCurrentActiveKey(key as tabsKeyEnum);
  };

  const pendingReviewByMeResponse = useRequest(
    () => {
      return workflow.getGlobalWorkflowsV1({
        page_index: 1,
        page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
        filter_create_user_name: username,
        filter_status: getGlobalWorkflowsV1FilterStatusEnum.wait_for_audit,
      });
    },
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  const pendingExecByMeResponse = useRequest(
    () => {
      return workflow.getGlobalWorkflowsV1({
        page_index: 1,
        page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
        filter_create_user_name: username,
        filter_status: getGlobalWorkflowsV1FilterStatusEnum.wait_for_execution,
      });
    },
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  const rejectedOrderByMeResponse = useRequest(
    () => {
      return workflow.getGlobalWorkflowsV1({
        page_index: 1,
        page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
        filter_create_user_name: username,
        filter_status: getGlobalWorkflowsV1FilterStatusEnum.rejected,
      });
    },
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  const showAllWithPendingReview = () => {
    history.push(
      `/order?${OrderListUrlParamsKey.createUsername}=${username}&${OrderListUrlParamsKey.status}=${getGlobalWorkflowsV1FilterStatusEnum.wait_for_audit}`
    );
  };
  const showAllWithPendingExec = () => {
    history.push(
      `/order?${OrderListUrlParamsKey.createUsername}=${username}&${OrderListUrlParamsKey.status}=${getGlobalWorkflowsV1FilterStatusEnum.wait_for_execution}`
    );
  };
  const showAllWithRejected = () => {
    history.push(
      `/order?${OrderListUrlParamsKey.createUsername}=${username}&${OrderListUrlParamsKey.status}=${getGlobalWorkflowsV1FilterStatusEnum.rejected}`
    );
  };

  const genShowAllMap = new Map<tabsKeyEnum, () => void>([
    [tabsKeyEnum.pendingExecByMe, showAllWithPendingExec],
    [tabsKeyEnum.pendingReviewByMe, showAllWithPendingReview],
    [tabsKeyEnum.rejectedOrderByMe, showAllWithRejected],
  ]);

  const tableLoading =
    pendingExecByMeResponse.loading ||
    pendingReviewByMeResponse.loading ||
    rejectedOrderByMeResponse.loading;

  const refreshTable = () => {
    if (tableLoading) {
      return;
    }

    pendingExecByMeResponse.refresh();
    pendingReviewByMeResponse.refresh();
    rejectedOrderByMeResponse.refresh();
    getWorkflowStatistics();
  };
  return (
    <Card className="full-width-element">
      <Tabs
        size="small"
        type="card"
        onChange={handleChangeTabs}
        activeKey={currentActiveKey}
        tabBarExtraContent={{
          left: (
            <span className="tab-panel-title">
              {t('dashboard.title.myOrderSituation')}
            </span>
          ),
          right: (
            <>
              <SyncOutlined
                data-testid="refreshTable"
                spin={tableLoading}
                onClick={refreshTable}
              />
              <Button
                type="link"
                onClick={genShowAllMap.get(currentActiveKey)}
                style={{ padding: 0, marginLeft: 10 }}
              >
                {t('common.more')}
              </Button>
            </>
          ),
        }}
      >
        <Tabs.TabPane
          tab={genTabPaneTitle(
            t('dashboard.myOrderSituation.pendingReviewByMe'),
            workflowStatistics?.my_need_review_workflow_number
          )}
          key={tabsKeyEnum.pendingReviewByMe}
        >
          <CommonTable
            tableInfo={{
              loading: pendingReviewByMeResponse.loading,
              data: pendingReviewByMeResponse.data ?? [],
              error: pendingReviewByMeResponse.error,
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={genTabPaneTitle(
            t('dashboard.myOrderSituation.pendingExecByMe'),
            workflowStatistics?.my_need_execute_workflow_number
          )}
          key={tabsKeyEnum.pendingExecByMe}
        >
          <CommonTable
            tableInfo={{
              loading: pendingExecByMeResponse.loading,
              data: pendingExecByMeResponse.data ?? [],
              error: pendingExecByMeResponse.error,
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={genTabPaneTitle(
            t('dashboard.myOrderSituation.rejectedOrderByMe'),
            workflowStatistics?.my_rejected_workflow_number
          )}
          key={tabsKeyEnum.rejectedOrderByMe}
        >
          <CommonTable
            tableInfo={{
              loading: rejectedOrderByMeResponse.loading,
              data: rejectedOrderByMeResponse.data ?? [],
              error: rejectedOrderByMeResponse.error,
            }}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default DBAPanel;
