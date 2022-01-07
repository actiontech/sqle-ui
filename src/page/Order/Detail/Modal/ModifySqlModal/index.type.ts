import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from './../../../../../api/common.enum';
import { IAuditTaskResV1 } from '../../../../../api/common.d';

export type ModifySqlModalProps = {
  cancel: () => void;
  submit: (
    taskId: number,
    passRate: number,
    instanceName?: string,
    audit_level?: CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
  ) => void;
  visible: boolean;
  currentOrderTask?: IAuditTaskResV1;
};
