import { message } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IGetWorkflowTasksItemV1,
  IWorkflowResV1,
} from '../../../../api/common';
import { GetWorkflowTasksItemV1StatusEnum } from '../../../../api/common.enum';
import workflow from '../../../../api/workflow';
import { ResponseCode } from '../../../../data/common';
import { MaintenanceTimeInfoType } from '../../AuditResult/index.type';
import { TasksStatusNumberType } from '../OrderSteps/index.type';

type HooksParamType = {
  workflowName: string;
  refreshOrder: () => Promise<IWorkflowResV1 | undefined>;
  refreshTask: () => void;
  refreshOverviewAction: (value?: boolean | undefined) => void;
  projectName: string;
};

const useGenerateOrderStepsProps = ({
  workflowName,
  refreshOrder,
  refreshTask,
  refreshOverviewAction,
  projectName,
}: HooksParamType) => {
  const { t } = useTranslation();

  const [tasksStatusNumber, setTasksStatusNumber] =
    useState<TasksStatusNumberType>();

  const [maintenanceTimeInfo, setMaintenanceTimeInfo] =
    useState<MaintenanceTimeInfoType>([]);
  const [canRejectOrder, setCanRejectOrder] = useState(false);

  const pass = useCallback(
    async (stepId: number) => {
      return workflow
        .approveWorkflowV1({
          workflow_name: workflowName,
          workflow_step_id: `${stepId}`,
          project_name: projectName,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(t('order.operator.approveSuccessTips'));
            refreshOrder();
            refreshOverviewAction();
          }
        });
    },
    [workflowName, projectName, t, refreshOrder, refreshOverviewAction]
  );

  const executing = useCallback(async () => {
    return workflow
      .executeTasksOnWorkflowV1({
        workflow_name: workflowName,
        project_name: projectName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('order.operator.executingTips'));
          refreshOrder();
          refreshTask();
          refreshOverviewAction();
        }
      });
  }, [
    projectName,
    refreshOrder,
    refreshOverviewAction,
    refreshTask,
    t,
    workflowName,
  ]);

  const reject = useCallback(
    async (reason: string, stepId: number) => {
      return workflow
        .rejectWorkflowV1({
          project_name: projectName,
          workflow_name: workflowName,
          workflow_step_id: `${stepId}`,
          reason,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(t('order.operator.rejectSuccessTips'));
            refreshOrder();
            refreshOverviewAction();
          }
        });
    },
    [projectName, refreshOrder, refreshOverviewAction, t, workflowName]
  );

  const complete = useCallback(async () => {
    return workflow
      .batchCompleteWorkflowsV1({
        workflow_names: [workflowName],
        project_name: projectName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('order.operator.completeSuccessTips'));
          refreshOrder();
          refreshTask();
          refreshOverviewAction();
        }
      });
  }, [
    projectName,
    refreshOrder,
    refreshOverviewAction,
    refreshTask,
    t,
    workflowName,
  ]);

  const getOverviewListSuccessHandle = (list: IGetWorkflowTasksItemV1[]) => {
    setMaintenanceTimeInfo?.(
      list.map((v) => ({
        instanceName: v.instance_name ?? '',
        maintenanceTime: v.instance_maintenance_times ?? [],
      }))
    );

    const canRejectOrder = list.every(
      (v) =>
        !!v.status &&
        ![
          GetWorkflowTasksItemV1StatusEnum.exec_succeeded,
          GetWorkflowTasksItemV1StatusEnum.executing,
          GetWorkflowTasksItemV1StatusEnum.exec_failed,
          GetWorkflowTasksItemV1StatusEnum.exec_scheduled,
        ].includes(v.status)
    );
    setCanRejectOrder(canRejectOrder);
    let succeededNumber = 0,
      executingNumber = 0,
      failedNumber = 0;
    list.forEach((v) => {
      if (v.status === GetWorkflowTasksItemV1StatusEnum.exec_succeeded) {
        succeededNumber++;
      } else if (v.status === GetWorkflowTasksItemV1StatusEnum.executing) {
        executingNumber++;
      } else if (v.status === GetWorkflowTasksItemV1StatusEnum.exec_failed) {
        failedNumber++;
      }
    });
    setTasksStatusNumber({
      failed: failedNumber,
      success: succeededNumber,
      executing: executingNumber,
    });
  };

  return {
    pass,
    executing,
    reject,
    maintenanceTimeInfo,
    canRejectOrder,
    tasksStatusNumber,
    getOverviewListSuccessHandle,
    complete,
  };
};

export default useGenerateOrderStepsProps;
