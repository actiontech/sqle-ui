import { useRequest, useToggle } from 'ahooks';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IAuditTaskResV1 } from '../../../../api/common';
import task from '../../../../api/task';
import workflow from '../../../../api/workflow';
import { ResponseCode } from '../../../../data/common';

const useGetDataWithRequest = () => {
  const urlParams = useParams<{ orderId: string }>();
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);
  const [refreshFlag, { toggle: refreshTask }] = useToggle(false);

  const { data: orderInfo, refresh: refreshOrder } = useRequest(
    () =>
      workflow.getWorkflowV2({
        workflow_id: Number.parseInt(urlParams.orderId),
      }),
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  useEffect(() => {
    const request = (taskId: string) => {
      return task.getAuditTaskV1({ task_id: taskId });
    };
    if (!!orderInfo) {
      Promise.all(
        (orderInfo?.record?.tasks ?? []).map((v) =>
          request(v.task_id?.toString() ?? '')
        )
      ).then((res) => {
        if (res.every((v) => v.data.code === ResponseCode.SUCCESS)) {
          setTaskInfos(res.map((v) => v.data.data!));
        }
      });
    }
  }, [orderInfo, refreshFlag]);

  return {
    taskInfos,
    orderInfo,
    refreshTask,
    refreshOrder,
  };
};

export default useGetDataWithRequest;
