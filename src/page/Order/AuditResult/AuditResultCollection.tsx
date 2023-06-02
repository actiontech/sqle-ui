import { Card, message, Result, Table, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import AuditResult from '.';
import { AuditResultCollectionProps } from './index.type';
import { auditResultOverviewColumn } from './column';
import workflow from '../../../api/workflow';
import {
  IExecuteOneTaskOnWorkflowV2Params,
  ITerminateSingleTaskByWorkflowV1Params,
  IUpdateWorkflowScheduleV2Params,
} from '../../../api/workflow/index.d';
import { ResponseCode } from '../../../data/common';
import ScheduleTimeModal from './ScheduleTimeModal';
import { useBoolean, useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { IGetWorkflowTasksItemV2 } from '../../../api/common';
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
  getOverviewListSuccessHandle,
  refreshOverviewFlag,
  orderStatus,
  projectName,
}) => {
  const { t } = useTranslation();
  const [currentTask, setCurrentTask] =
    useState<IGetWorkflowTasksItemV2 | null>(null);
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const [
    scheduleVisible,
    { setTrue: openScheduleModal, setFalse: closeScheduleModal },
  ] = useBoolean();

  const {
    loading,
    data: overviewList,
    error,
    refresh: refreshOverview,
  } = useRequest(
    () =>
      workflow
        .getSummaryOfInstanceTasksV2({
          workflow_id: workflowId ?? '',
          project_name: projectName,
        })
        .then((res) => res.data.data ?? []),
    {
      refreshDeps: [refreshOverviewFlag],
      ready: !!showOverview && !!workflowId,
      onSuccess: getOverviewListSuccessHandle,
    }
  );

  const sqlExecuteHandle = (taskId: string) => {
    const param: IExecuteOneTaskOnWorkflowV2Params = {
      workflow_id: workflowId ?? '',
      task_id: taskId,
      project_name: projectName,
    };
    workflow.executeOneTaskOnWorkflowV2(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(t('order.status.finished'));
        refreshOverview();
        refreshOrder?.();
      }
    });
  };

  const sqlTerminateHandle = (taskId: string) => {
    const param: ITerminateSingleTaskByWorkflowV1Params = {
      workflow_id: workflowId ?? '',
      task_id: taskId,
      project_name: projectName,
    };
    workflow.terminateSingleTaskByWorkflowV1(param).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(t('order.operator.terminateSuccessTips'));
        refreshOverview();
        refreshOrder?.();
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
      project_name: projectName,
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

  const openScheduleModalAndSetCurrentTask = (
    record: IGetWorkflowTasksItemV2
  ) => {
    openScheduleModal();
    setCurrentTask(record);
  };

  const overviewTableRowClick = (record: IGetWorkflowTasksItemV2) => {
    setAuditResultActiveKey(record.task_id?.toString() ?? '');
  };

  const tabItems = (): TabsProps['items'] => {
    const tabs: TabsProps['items'] = taskInfos.map((v) => {
      return {
        key: `${v.task_id}`,
        label: v.instance_name ?? '',
        children: (
          <>
            <AuditResult
              taskId={v?.task_id}
              passRate={v?.pass_rate}
              auditScore={v?.score}
              updateTaskRecordTotalNum={updateTaskRecordTotalNum}
              instanceSchema={v.instance_schema}
              projectName={projectName}
            />
          </>
        ),
      };
    });

    const overviewTab = {
      key: OVERVIEW_TAB_KEY,
      label: t('order.auditResultCollection.overview'),
      children: (
        <Table
          rowClassName="pointer"
          rowKey="task_id"
          loading={loading}
          columns={auditResultOverviewColumn(
            sqlExecuteHandle,
            sqlTerminateHandle,
            openScheduleModalAndSetCurrentTask,
            scheduleTimeHandle,
            username,
            orderStatus
          )}
          dataSource={overviewList ?? []}
          onRow={(record) => {
            return {
              onClick: () => {
                overviewTableRowClick(record);
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
      ),
    };

    return showOverview ? [overviewTab, ...tabs] : tabs;
  };

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
          items={tabItems()}
        />
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
