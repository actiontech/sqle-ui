import { message } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IGetWorkflowTasksItemV1,
  IWorkflowResV2,
} from '../../../../api/common';
import { GetWorkflowTasksItemV1StatusEnum } from '../../../../api/common.enum';
import workflow from '../../../../api/workflow';
import { ResponseCode } from '../../../../data/common';
import { MaintenanceTimeInfoType } from '../../AuditResult/index.type';
import { TasksStatusNumberType } from '../OrderSteps/index.type';

type HooksParamType = {
  workflowId: string;
  refreshOrder: () => Promise<IWorkflowResV2 | undefined>;
  refreshTask: () => void;
  refreshOverviewAction: (value?: boolean | undefined) => void;
};

const useGenerateOrderStepsProps = ({
  workflowId,
  refreshOrder,
  refreshTask,
  refreshOverviewAction,
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
          workflow_id: workflowId,
          workflow_step_id: `${stepId}`,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(t('order.operator.approveSuccessTips'));
            refreshOrder();
            refreshOverviewAction();
          }
        });
    },
    [workflowId, t, refreshOrder, refreshOverviewAction]
  );

  const executing = useCallback(async () => {
    return workflow
      .executeTasksOnWorkflowV2({
        workflow_id: workflowId,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('order.operator.executingTips'));
          refreshOrder();
          refreshTask();
          refreshOverviewAction();
        }
      });
  }, [refreshOrder, refreshOverviewAction, refreshTask, t, workflowId]);

  const reject = useCallback(
    async (reason: string, stepId: number) => {
      return workflow
        .rejectWorkflowV1({
          workflow_id: workflowId,
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
    [refreshOrder, refreshOverviewAction, t, workflowId]
  );

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
  };
};

export default useGenerateOrderStepsProps;
