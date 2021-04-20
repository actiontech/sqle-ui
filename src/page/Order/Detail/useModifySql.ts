import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';

const useModifySql = () => {
  const [tempTaskId, setTempTaskId] = useState<number>();
  const [tempPassRate, setPassRate] = useState<number>();
  const [
    visible,
    { setTrue: openModifySqlModal, setFalse: closeModifySqlModal },
  ] = useBoolean();

  const modifySqlSubmit = useCallback(
    (taskId: number, passRate: number) => {
      setTempTaskId(taskId);
      setPassRate(passRate);
      closeModifySqlModal();
    },
    [closeModifySqlModal]
  );

  const resetAllState = () => {
    setTempTaskId(undefined);
    setPassRate(undefined);
    closeModifySqlModal();
  };

  return {
    visible,
    tempTaskId,
    tempPassRate,
    openModifySqlModal,
    closeModifySqlModal,
    modifySqlSubmit,
    resetAllState,
  };
};

export default useModifySql;
