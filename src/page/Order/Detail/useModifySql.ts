import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';
import { IAuditTaskResV1 } from '../../../api/common';
import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '../../../api/common.enum';
import { useAllowAuditLevel } from '../hooks/useAllowAuditLevel';

const useModifySql = () => {
  const [taskInfo, setTaskInfo] = useState<IAuditTaskResV1>();

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
    (task: IAuditTaskResV1) => {
      setTaskInfo(task);
      closeModifySqlModal();
      if (task.instance_name) {
        judgeAuditLevel(
          task.instance_name,
          setUpdateOrderBtnDisabled,
          resetUpdateOrderBtnStatus,
          task.audit_level as
            | CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
            | undefined
        );
      }
    },
    [
      closeModifySqlModal,
      judgeAuditLevel,
      resetUpdateOrderBtnStatus,
      setUpdateOrderBtnDisabled,
    ]
  );

  const resetAllState = () => {
    setTaskInfo(undefined);
    setDisabledOperatorOrderBtnTips('');
    closeModifySqlModal();
    resetUpdateOrderBtnStatus();
  };

  return {
    taskInfo,
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
