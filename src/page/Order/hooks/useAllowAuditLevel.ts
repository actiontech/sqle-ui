import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from './../../../api/common.enum';
import instance from '../../../api/instance';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const judgeLevelMap = new Map<
  CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  number
>([
  [CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal, 0],
  [CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.notice, 1],
  [CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn, 2],
  [CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error, 3],
]);

export const useAllowAuditLevel = () => {
  const { t } = useTranslation();

  const [disabledOperatorOrderBtnTips, setDisabledOperatorOrderBtnTips] =
    useState('');
  const judgeAuditLevel = async (
    instanceName: string,
    setBtnDisabled: () => void,
    resetBtnDisabled: () => void,
    currentAuditLevel?: CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
  ) => {
    const {
      data: { data: { allow_submit_when_less_audit_level } = {} },
    } = await instance.getInstanceWorkflowTemplateV1({
      instance_name: instanceName,
    });

    if (
      isExistNotAllowLevel(
        currentAuditLevel,
        allow_submit_when_less_audit_level as
          | CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
          | undefined
      )
    ) {
      setDisabledOperatorOrderBtnTips(
        t('order.operator.disabledOperatorOrderBtnTips', {
          allowAuditLevel: allow_submit_when_less_audit_level,
          currentAuditLevel: currentAuditLevel,
        })
      );
      setBtnDisabled();
    } else {
      resetBtnDisabled();
      setDisabledOperatorOrderBtnTips('');
    }
  };

  const isExistNotAllowLevel = (
    currentAuditLevel?: CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
    allowAuditLevel?: CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
  ) => {
    if (!currentAuditLevel || !allowAuditLevel) {
      return false;
    }
    return (
      (judgeLevelMap.get(currentAuditLevel) ?? 0) >
      (judgeLevelMap.get(allowAuditLevel) ?? 0)
    );
  };

  return {
    judgeAuditLevel,
    disabledOperatorOrderBtnTips,
    setDisabledOperatorOrderBtnTips,
  };
};
