import { useBoolean } from 'ahooks';
import { useCallback } from 'react';
import { WorkflowResV2ModeEnum } from '../../../../api/common.enum';
import { SqlInfoFormFields } from '../../Create/SqlInfoForm/index.type';
import useAuditOrder from '../../hooks/useAuditOrder';

const useModifySql = (sqlMode: WorkflowResV2ModeEnum) => {
  const [
    modifySqlModalVisibility,
    { setTrue: openModifySqlModal, setFalse: closeModifySqlModal },
  ] = useBoolean();

  const {
    taskInfos,
    auditOrderWithSameSql,
    auditOrderWthDifferenceSql,
    auditResultActiveKey,
    setAuditResultActiveKey,
    isDisableFinallySubmitButton,
    disabledOperatorOrderBtnTips,
    resetFinallySubmitButtonStatus,
    clearDifferenceSqlModeTaskInfos,
  } = useAuditOrder();

  const modifySqlSubmit = useCallback(
    async (
      values: SqlInfoFormFields,
      currentTabIndex: number,
      currentTabKey: string
    ) => {
      if (sqlMode === WorkflowResV2ModeEnum.same_sqls) {
        await auditOrderWithSameSql(values);
        closeModifySqlModal();
      } else {
        auditOrderWthDifferenceSql(values, currentTabIndex, currentTabKey);
      }
    },
    [
      auditOrderWithSameSql,
      auditOrderWthDifferenceSql,
      closeModifySqlModal,
      sqlMode,
    ]
  );

  const resetAllState = () => {
    clearDifferenceSqlModeTaskInfos();
    resetFinallySubmitButtonStatus();
    closeModifySqlModal();
  };

  return {
    taskInfos,
    modifySqlModalVisibility,
    openModifySqlModal,
    closeModifySqlModal,
    modifySqlSubmit,
    resetAllState,
    auditResultActiveKey,
    setAuditResultActiveKey,
    disabledOperatorOrderBtnTips,
    isDisableFinallySubmitButton,
  };
};

export default useModifySql;
