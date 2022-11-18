import { IWorkflowTemplateDetailResV1 } from '../../../../api/common';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '../../../../api/common.enum';

export type BaseFormProps = {
  defaultData?: IWorkflowTemplateDetailResV1;
  nextStep: () => void;
  updateBaseInfo: (info: BaseFormFields) => void;
};

export type BaseFormFields = {
  name: string;
  desc?: string;
  instanceNameList?: string[];
  allowSubmitWhenLessAuditLevel?: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum;
};
