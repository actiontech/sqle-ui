import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from './../../../api/common.enum';
import instance from '../../../api/instance';
import { useCallback, useState } from 'react';
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
  const judgeAuditLevel = useCallback(
    async (
      taskInfos: Array<{
        instanceName: string;
        currentAuditLevel?: CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum;
      }>,
      setBtnDisabled: () => void,
      resetBtnDisabled: () => void
    ) => {
      const request = (instanceName: string) => {
        return instance.getInstanceWorkflowTemplateV1({
          instance_name: instanceName,
        });
      };

      const tips: string[] = [];
      Promise.all(
        taskInfos.map((taskInfo) => request(taskInfo.instanceName))
      ).then((res) => {
        const invalidTasks = res.filter((v, index) => {
          const currentInstanceName = taskInfos[index].instanceName;
          const currentAuditLevel = taskInfos[index].currentAuditLevel;
          const allowAuditLevel = v.data.data
            ?.allow_submit_when_less_audit_level as
            | CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
            | undefined;
          if (isExistNotAllowLevel(currentAuditLevel, allowAuditLevel)) {
            tips.push(
              t('order.operator.disabledOperatorOrderBtnTips', {
                currentInstanceName: currentInstanceName,
                allowAuditLevel: allowAuditLevel,
                currentAuditLevel: currentAuditLevel,
              })
            );
            return true;
          }
          return false;
        });

        if (invalidTasks.length > 0 && tips.length > 0) {
          setDisabledOperatorOrderBtnTips(tips.join('\n'));
          setBtnDisabled();
        } else {
          resetBtnDisabled();
          setDisabledOperatorOrderBtnTips('');
        }
      });
    },
    [t]
  );

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
