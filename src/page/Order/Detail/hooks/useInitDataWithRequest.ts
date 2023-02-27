import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IAuditTaskResV1 } from '../../../../api/common';
import task from '../../../../api/task';
import workflow from '../../../../api/workflow';
import { ResponseCode } from '../../../../data/common';
import { useCurrentProjectName } from '../../../ProjectManage/ProjectDetail';

const useInitDataWithRequest = () => {
  const urlParams = useParams<{ orderId: string }>();
  const { projectName } = useCurrentProjectName();
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);
  const [
    getTaskInfosLoading,
    { setFalse: finishGetTaskInfos, setTrue: startGetTaskInfos },
  ] = useBoolean();
  const {
    data: orderInfo,
    refresh: refreshOrder,
    loading: getWorkflowLoading,
  } = useRequest(
    () =>
      workflow.getWorkflowV2({
        project_name: projectName,
        workflow_id: urlParams.orderId,
      }),
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  const refreshTask = useCallback(() => {
    const request = (taskId: string) => {
      return task.getAuditTaskV1({ task_id: taskId });
    };
    if (!!orderInfo) {
      startGetTaskInfos();
      Promise.all(
        (orderInfo?.record?.tasks ?? []).map((v) =>
          request(v.task_id?.toString() ?? '')
        )
      )
        .then((res) => {
          if (res.every((v) => v.data.code === ResponseCode.SUCCESS)) {
            setTaskInfos(res.map((v) => v.data.data!));
          }
        })
        .finally(() => {
          finishGetTaskInfos();
        });
    }
  }, [finishGetTaskInfos, orderInfo, startGetTaskInfos]);

  const initLoading = useMemo(
    () => getTaskInfosLoading || getWorkflowLoading,
    [getTaskInfosLoading, getWorkflowLoading]
  );

  useEffect(() => {
    refreshTask();
  }, [refreshTask]);

  return {
    taskInfos,
    orderInfo,
    refreshTask,
    refreshOrder,
    initLoading,
  };
};

export default useInitDataWithRequest;
