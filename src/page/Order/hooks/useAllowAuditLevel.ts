import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from './../../../api/common.enum';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import workflow from '../../../api/workflow';

const judgeLevelMap = new Map<
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
  number
>([
  [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal, 0],
  [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.notice, 1],
  [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn, 2],
  [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error, 3],
]);

export const useAllowAuditLevel = () => {
  const { t } = useTranslation();

  const [disabledOperatorOrderBtnTips, setDisabledOperatorOrderBtnTips] =
    useState('');
  const judgeAuditLevel = useCallback(
    async (
      taskInfos: Array<{
        projectName: string;
        instanceName: string;
        currentAuditLevel?: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum;
      }>,
      setBtnDisabled: () => void,
      resetBtnDisabled: () => void
    ) => {
      const request = (projectName: string) => {
        return workflow.getWorkflowTemplateV1({
          project_name: projectName,
        });
      };

      const tips: string[] = [];
      Promise.all(
        taskInfos.map((taskInfo) => request(taskInfo.projectName))
      ).then((res) => {
        const invalidTasks = res.filter((v, index) => {
          const projectName = taskInfos[index].projectName;
          const currentAuditLevel = taskInfos[index].currentAuditLevel;
          const allowAuditLevel = v.data.data
            ?.allow_submit_when_less_audit_level as
            | WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
            | undefined;
          if (isExistNotAllowLevel(currentAuditLevel, allowAuditLevel)) {
            tips.push(
              t('order.operator.disabledOperatorOrderBtnTips', {
                currentProject: projectName,
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
    currentAuditLevel?: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
    allowAuditLevel?: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
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
