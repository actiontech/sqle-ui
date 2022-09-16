import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';
import { IAuditTaskResV1 } from '../../../api/common';
import {
  CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  WorkflowResV2ModeEnum,
} from '../../../api/common.enum';
import { useAllowAuditLevel } from '../hooks/useAllowAuditLevel';

const useModifySql = (
  sqlMode: WorkflowResV2ModeEnum,
  setTempAuditResultActiveKey: React.Dispatch<React.SetStateAction<string>>
) => {
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);

  const [
    updateOrderDisabled,
    { setTrue: setUpdateOrderBtnDisabled, setFalse: resetUpdateOrderBtnStatus },
  ] = useBoolean(false);
  const [visible, { setTrue: openModifySqlModal, setFalse }] = useBoolean();

  const {
    disabledOperatorOrderBtnTips,
    judgeAuditLevel,
    setDisabledOperatorOrderBtnTips,
  } = useAllowAuditLevel();

  const closeModifySqlModal = useCallback(
    (tasks?: IAuditTaskResV1[]) => {
      setFalse();
      setTempAuditResultActiveKey(tasks?.[0]?.task_id?.toString() ?? '');
    },
    [setTempAuditResultActiveKey, setFalse]
  );

  const modifySqlSubmit = useCallback(
    (tasks: IAuditTaskResV1[]) => {
      setTaskInfos(tasks);
      if (sqlMode === WorkflowResV2ModeEnum.different_sqls) {
        return;
      }
      closeModifySqlModal(tasks);
      if ((tasks?.length ?? 0) > 0) {
        judgeAuditLevel(
          tasks?.map((v) => ({
            instanceName: v.instance_name ?? '',
            currentAuditLevel: v.audit_level as
              | CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
              | undefined,
          })) ?? [],
          setUpdateOrderBtnDisabled,
          resetUpdateOrderBtnStatus
        );
      }
    },
    [
      closeModifySqlModal,
      judgeAuditLevel,
      resetUpdateOrderBtnStatus,
      setUpdateOrderBtnDisabled,
      sqlMode,
    ]
  );

  const resetAllState = () => {
    setTaskInfos([]);
    setDisabledOperatorOrderBtnTips('');
    closeModifySqlModal();
    resetUpdateOrderBtnStatus();
  };

  return {
    taskInfos,
    visible,
    openModifySqlModal,
    closeModifySqlModal,
    modifySqlSubmit,
    resetAllState,
    updateOrderDisabled,
    setUpdateOrderBtnDisabled,
    disabledOperatorOrderBtnTips,
  };
};

export default useModifySql;
