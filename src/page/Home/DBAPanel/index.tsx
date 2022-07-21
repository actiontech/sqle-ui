import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Tabs, TabsProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import workflow from '../../../api/workflow';
import {
  getWorkflowListV1FilterCurrentStepTypeEnum,
  getWorkflowListV1FilterStatusEnum,
} from '../../../api/workflow/index.enum';
import { IReduxState } from '../../../store';
import { OrderListUrlParamsKey } from '../../Order/List/index.data';
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

  const history = useHistory();
  const [currentActiveKey, setCurrentActiveKey] = useState<tabsKeyEnum>(
    tabsKeyEnum.needMeReview
  );
  const { t } = useTranslation();

  const handleChangeTabs: TabsProps['onChange'] = (key) => {
    setCurrentActiveKey(key as tabsKeyEnum);
  };

  const needMeReviewResponse = useRequest(
    () => {
      return workflow.getWorkflowListV1({
        page_index: 1,
        page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
        filter_current_step_assignee_user_name: username,
        filter_status: getWorkflowListV1FilterStatusEnum.on_process,
        filter_current_step_type:
          getWorkflowListV1FilterCurrentStepTypeEnum.sql_review,
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
      return workflow.getWorkflowListV1({
        page_index: 1,
        page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
        filter_current_step_assignee_user_name: username,
        filter_status: getWorkflowListV1FilterStatusEnum.on_process,
        filter_current_step_type:
          getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute,
      });
    },
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  const showAllWithNeedMeReview = () => {
    history.push(
      `/order?${OrderListUrlParamsKey.currentStepAssignee}=${username}&${OrderListUrlParamsKey.currentStepType}=${getWorkflowListV1FilterCurrentStepTypeEnum.sql_review}&${OrderListUrlParamsKey.status}=${getWorkflowListV1FilterStatusEnum.on_process}`
    );
  };
  const showAllWithNeedMeExec = () => {
    history.push(
      `order?${OrderListUrlParamsKey.currentStepAssignee}=${username}&${OrderListUrlParamsKey.currentStepType}=${getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute}&${OrderListUrlParamsKey.status}=${getWorkflowListV1FilterStatusEnum.on_process}`
    );
  };

  const genShowAllMap = new Map<tabsKeyEnum, () => void>([
    [tabsKeyEnum.needMeReview, showAllWithNeedMeReview],
    [tabsKeyEnum.needMeExec, showAllWithNeedMeExec],
  ]);

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
        size="small"
        type="card"
        onChange={handleChangeTabs}
        activeKey={currentActiveKey}
        tabBarExtraContent={
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
              {t('common.showAll')}
            </Button>
          </>
        }
      >
        <Tabs.TabPane
          tab={genTabPaneTitle(
            t('dashboard.title.needMeReview'),
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
            t('dashboard.title.needMeExec'),
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
