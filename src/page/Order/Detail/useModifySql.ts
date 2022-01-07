import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';
import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '../../../api/common.enum';
import { useAllowAuditLevel } from '../hooks/useAllowAuditLevel';

const useModifySql = () => {
  const [tempTaskId, setTempTaskId] = useState<number>();
  const [tempPassRate, setPassRate] = useState<number>();
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
    async (
      taskId: number,
      passRate: number,
      instanceName?: string,
      audit_level?: CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
    ) => {
      setTempTaskId(taskId);
      setPassRate(passRate);
      closeModifySqlModal();
      if (instanceName) {
        judgeAuditLevel(instanceName, setUpdateOrderBtnDisabled, audit_level);
      }
    },
    [closeModifySqlModal, judgeAuditLevel, setUpdateOrderBtnDisabled]
  );

  const resetAllState = () => {
    setTempTaskId(undefined);
    setPassRate(undefined);
    setDisabledOperatorOrderBtnTips('');
    closeModifySqlModal();
    resetUpdateOrderBtnStatus();
  };

  return {
    visible,
    tempTaskId,
    tempPassRate,
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
