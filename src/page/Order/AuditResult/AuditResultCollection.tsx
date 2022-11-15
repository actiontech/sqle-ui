import { Card, message, Result, Table, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import AuditResult from '.';
import { AuditResultCollectionProps } from './index.type';
import { auditResultOverviewColumn } from './column';
import workflow from '../../../api/workflow';
import {
  IExecuteOneTaskOnWorkflowV1Params,
  IUpdateWorkflowScheduleV1Params,
} from '../../../api/workflow/index.d';
import { ResponseCode } from '../../../data/common';
import ScheduleTimeModal from './ScheduleTimeModal';
import { useBoolean, useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { IGetWorkflowTasksItemV1 } from '../../../api/common';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';

const OVERVIEW_TAB_KEY = 'OVERVIEW_TAB_KEY';

const AuditResultCollection: React.FC<AuditResultCollectionProps> = ({
  taskInfos,
  auditResultActiveKey,
  setAuditResultActiveKey,
  updateTaskRecordTotalNum,
  showOverview = false,
  workflowName,
  refreshOrder,
  getOverviewListSuccessHandle,
  refreshOverviewFlag,
  orderStatus,
  projectName,
}) => {
  const { t } = useTranslation();
  const [currentTask, setCurrentTask] =
    useState<IGetWorkflowTasksItemV1 | null>(null);
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const [
    scheduleVisible,
    { setTrue: openScheduleModal, setFalse: closeScheduleModal },
  ] = useBoolean();

  const sqlExecuteHandle = (taskId: string) => {
    if (!workflowName) {
      return;
    }
    const param: IExecuteOneTaskOnWorkflowV1Params = {
      workflow_name: workflowName,
      task_id: taskId,
      project_name: projectName,
    };
    workflow.executeOneTaskOnWorkflowV1(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(t('order.status.finished'));
        refreshOverview();
        refreshOrder?.();
      }
    });
  };

  const scheduleTimeHandle = (
    scheduleTime?: string,
    taskId = currentTask?.task_id?.toString()
  ) => {
    const param: IUpdateWorkflowScheduleV1Params = {
      workflow_name: workflowName ?? '',
      task_id: taskId ?? '',
      schedule_time: scheduleTime,
      project_name: projectName,
    };
    return workflow.updateWorkflowScheduleV1(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(
          scheduleTime
            ? t('order.operator.execScheduleTips')
            : t('order.auditResultCollection.table.cancelExecScheduledTips')
        );
        refreshOverview();
        refreshOrder?.();
      }
    });
  };

  const {
    loading,
    data: overviewList,
    error,
    refresh: refreshOverview,
  } = useRequest(
    () =>
      workflow.getSummaryOfInstanceTasksV1({
        workflow_name: Number(workflowName),
        project_name: projectName,
      }),
    {
      refreshDeps: [refreshOverviewFlag],
      ready: !!showOverview && !!workflowName,
      formatResult: (res) => res.data.data ?? [],
      onSuccess: getOverviewListSuccessHandle,
    }
  );

  useEffect(() => {
    if (showOverview) {
      setAuditResultActiveKey(OVERVIEW_TAB_KEY);
    }
  }, [setAuditResultActiveKey, showOverview]);

  return (
    <>
      <Card>
        <Tabs
          activeKey={auditResultActiveKey}
          onChange={setAuditResultActiveKey}
        >
          <>
            {showOverview && (
              <Tabs.TabPane
                tab={t('order.auditResultCollection.overview')}
                key={OVERVIEW_TAB_KEY}
              >
                <Table
                  rowKey="task_id"
                  loading={loading}
                  columns={auditResultOverviewColumn(
                    sqlExecuteHandle,
                    openScheduleModal,
                    scheduleTimeHandle,
                    username,
                    orderStatus
                  )}
                  dataSource={overviewList ?? []}
                  onRow={(record) => {
                    return {
                      onClick: () => {
                        setCurrentTask(record);
                      },
                    };
                  }}
                  pagination={false}
                  locale={{
                    emptyText: error ? (
                      <Result
                        status="error"
                        title={t('common.request.noticeFailTitle')}
                        subTitle={error?.message ?? t('common.unknownError')}
                      />
                    ) : undefined,
                  }}
                />
              </Tabs.TabPane>
            )}
            {taskInfos.map((v) => {
              if (!v.task_id) {
                return null;
              }
              return (
                <Tabs.TabPane tab={v?.instance_name} key={v?.task_id}>
                  <AuditResult
                    taskId={v?.task_id}
                    passRate={v?.pass_rate}
                    auditScore={v?.score}
                    updateTaskRecordTotalNum={updateTaskRecordTotalNum}
                    instanceSchema={v.instance_schema}
                  />
                </Tabs.TabPane>
              );
            })}
          </>
        </Tabs>
      </Card>

      <ScheduleTimeModal
        visible={scheduleVisible}
        closeScheduleModal={closeScheduleModal}
        submit={scheduleTimeHandle}
        maintenanceTime={currentTask?.instance_maintenance_times ?? []}
      />
    </>
  );
};

export default AuditResultCollection;
