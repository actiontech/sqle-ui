import { IWorkflowTemplateDetailResV1 } from '../../../../api/common';

export type BaseFormProps = {
  defaultData?: IWorkflowTemplateDetailResV1;
  nextStep: () => void;
  updateBaseInfo: (info: BaseFormFields) => void;
};

export type BaseFormFields = {
  name: string;
  desc?: string;
  instanceNameList?: string[];
};
