import { AxiosResponse } from 'axios';
import {
  IWorkFlowStepTemplateReqV1,
  IWorkflowTemplateDetailResV1,
} from '../../../api/common';
import { IUpdateWorkflowTemplateV1Return } from '../../../api/workflow/index.d';
import { BaseFormFields } from './BaseForm/index.type';

export type WorkflowTemplateFormProps = {
  projectName: string;
  defaultData?: IWorkflowTemplateDetailResV1;
  updateBaseInfo: (info: BaseFormFields) => void;
  submitProgress: (
    process: IWorkFlowStepTemplateReqV1[]
  ) => Promise<AxiosResponse<IUpdateWorkflowTemplateV1Return>>;
};
