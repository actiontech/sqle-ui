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

const OVERVIEW_TAB_KEY = 'OVERVIEW_TAB_KEY';

const AuditResultCollection: React.FC<AuditResultCollectionProps> = ({
  taskInfos,
  auditResultActiveKey,
  setAuditResultActiveKey,
  updateTaskRecordTotalNum,
  showOverview = false,
  workflowId,
  refreshOrder,
  setIsExistScheduleTask,
  refreshOverviewFlag,
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
        const isExistScheduleTask = res.some((v) => !!v.schedule_time);
        setIsExistScheduleTask?.(isExistScheduleTask);
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
                  loading={loading}
                  columns={auditResultOverviewColumn(
                    sqlExecuteHandle,
                    openScheduleModal,
                    scheduleTimeHandle
                  )}
                  dataSource={overviewList ?? []}
                  onRow={(record) => {
                    return {
                      onClick: () => {
                        setCurrentTaskId(record.task_id?.toString() ?? '');
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
      />
    </>
  );
};

export default AuditResultCollection;
