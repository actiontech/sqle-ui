import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';
import { IAuditTaskResV1 } from '../../../api/common';
import {
  CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  WorkflowResV2ModeEnum,
} from '../../../api/common.enum';
import { useAllowAuditLevel } from '../hooks/useAllowAuditLevel';

const useModifySql = (sqlMode: WorkflowResV2ModeEnum) => {
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);

  const [
    updateOrderDisabled,
    { setTrue: setUpdateOrderBtnDisabled, setFalse: resetUpdateOrderBtnStatus },
  ] = useBoolean(false);
  const [
    visible,
    { setTrue: openModifySqlModal, setFalse: closeModifySqlModal },
  ] = useBoolean();

  const {
    disabledOperatorOrderBtnTips,
    judgeAuditLevel,
    setDisabledOperatorOrderBtnTips,
  } = useAllowAuditLevel();

  const modifySqlSubmit = useCallback(
    (tasks: IAuditTaskResV1[]) => {
      setTaskInfos(tasks);
      if (sqlMode === WorkflowResV2ModeEnum.different_sqls) {
        return;
      }
      closeModifySqlModal();
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
