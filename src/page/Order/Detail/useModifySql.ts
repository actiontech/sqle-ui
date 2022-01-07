import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';

const useModifySql = () => {
  const [tempTaskId, setTempTaskId] = useState<number>();
  const [tempPassRate, setPassRate] = useState<number>();
  const [instanceName, setInstanceName] = useState<string | undefined>();
  const [
    updateOrderDisabled,
    { setTrue: setUpdateOrderBtnDisabled, setFalse: resetUpdateOrderBtnStatus },
  ] = useBoolean(false);
  const [
    visible,
    { setTrue: openModifySqlModal, setFalse: closeModifySqlModal },
  ] = useBoolean();

  const modifySqlSubmit = useCallback(
    (taskId: number, passRate: number, instanceName?: string) => {
      setTempTaskId(taskId);
      setPassRate(passRate);
      setInstanceName(instanceName);
      closeModifySqlModal();
    },
    [closeModifySqlModal]
  );

  const resetAllState = () => {
    setTempTaskId(undefined);
    setPassRate(undefined);
    closeModifySqlModal();
    resetUpdateOrderBtnStatus();
    setInstanceName(undefined);
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
    instanceName,
  };
};

export default useModifySql;
