import { Card, message, Result, Table, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import AuditResult from '.';
import EmptyBox from '../../../components/EmptyBox';
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
import { useState } from 'react';
import { IGetWorkflowTasksItemV1 } from '../../../api/common';

const AuditResultCollection: React.FC<AuditResultCollectionProps> = ({
  taskInfos,
  auditResultActiveKey,
  setAuditResultActiveKey,
  updateTaskRecordTotalNum,
  showOverview = false,
  workflowId,
  refreshOrder,
  setIsExistScheduleTask,
}) => {
  const { t } = useTranslation();
  const [currentTaskId, setCurrentTaskId] = useState('');

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

  const scheduleTimeHandle = (scheduleTime?: string) => {
    const param: IUpdateWorkflowScheduleV2Params = {
      workflow_id: workflowId ?? '',
      task_id: currentTaskId,
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

  const openScheduleModalAndSetTaskId = (taskId: string) => {
    openScheduleModal();
    setCurrentTaskId(taskId);
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
      ready: !!showOverview && !!workflowId && !!setIsExistScheduleTask,
      formatResult: (res) => res.data.data ?? [],
      onSuccess: (res: IGetWorkflowTasksItemV1[]) => {
        const isExistScheduleTask = res.some((v) => !!v.schedule_time);
        setIsExistScheduleTask?.(isExistScheduleTask);
      },
    }
  );

  return (
    <>
      <Card>
        <Tabs
          activeKey={auditResultActiveKey}
          onChange={setAuditResultActiveKey}
        >
          <>
            <EmptyBox if={showOverview && !!workflowId}>
              <Tabs.TabPane tab={t('order.auditResultCollection.overview')}>
                <Table
                  loading={loading}
                  columns={auditResultOverviewColumn(
                    sqlExecuteHandle,
                    openScheduleModalAndSetTaskId,
                    scheduleTimeHandle
                  )}
                  dataSource={overviewList ?? []}
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
            </EmptyBox>
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
      />
    </>
  );
};

export default AuditResultCollection;
