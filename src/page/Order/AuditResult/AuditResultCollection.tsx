import { Card, message, Result, Table, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import AuditResult from '.';
import { AuditResultCollectionProps } from './index.type';
import { auditResultOverviewColumn } from './column';
import workflow from '../../../api/workflow';
import {
  IExecuteOneTaskOnWorkflowV1Params,
  IUpdateWorkflowScheduleV2Params,
} from '../../../api/workflow/index.d';
import { ResponseCode } from '../../../data/common';
import ScheduleTimeModal from './ScheduleTimeModal';
import { useBoolean, useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { IGetWorkflowTasksItemV1 } from '../../../api/common';
import { GetWorkflowTasksItemV1StatusEnum } from '../../../api/common.enum';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';

const OVERVIEW_TAB_KEY = 'OVERVIEW_TAB_KEY';

const AuditResultCollection: React.FC<AuditResultCollectionProps> = ({
  taskInfos,
  auditResultActiveKey,
  setAuditResultActiveKey,
  updateTaskRecordTotalNum,
  showOverview = false,
  workflowId,
  refreshOrder,
  setCanRejectOrder,
  refreshOverviewFlag,
  orderStatus,
  setMaintenanceTimeInfo,
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
    if (!workflowId) {
      return;
    }
    const param: IExecuteOneTaskOnWorkflowV1Params = {
      workflow_id: workflowId,
      task_id: taskId,
    };
    workflow.executeOneTaskOnWorkflowV1(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(t('order.status.finished'));
        refreshOverview();
        refreshOrder?.();
      } else {
        message.error(res.data.message);
      }
    });
  };

  const scheduleTimeHandle = (
    scheduleTime?: string,
    taskId = currentTask?.task_id?.toString()
  ) => {
    const param: IUpdateWorkflowScheduleV2Params = {
      workflow_id: workflowId ?? '',
      task_id: taskId ?? '',
      schedule_time: scheduleTime,
    };
    return workflow.updateWorkflowScheduleV2(param).then((res) => {
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
      workflow.getSummaryOfInstanceTasksV1({ workflow_id: Number(workflowId) }),
    {
      refreshDeps: [refreshOverviewFlag],
      ready: !!showOverview && !!workflowId,
      formatResult: (res) => res.data.data ?? [],
      onSuccess: (res: IGetWorkflowTasksItemV1[]) => {
        if (!res.some) {
          return;
        }

        setMaintenanceTimeInfo?.(
          res.map((v) => ({
            instanceName: v.instance_name ?? '',
            maintenanceTime: v.instance_maintenance_times ?? [],
          }))
        );

        const canRejectOrder = res.every(
          (v) =>
            !!v.status &&
            ![
              GetWorkflowTasksItemV1StatusEnum.exec_succeeded,
              GetWorkflowTasksItemV1StatusEnum.executing,
              GetWorkflowTasksItemV1StatusEnum.exec_failed,
              GetWorkflowTasksItemV1StatusEnum.exec_scheduled,
            ].includes(v.status)
        );
        setCanRejectOrder?.(canRejectOrder);
      },
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
