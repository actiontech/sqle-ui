import {
  IWorkFlowStepTemplateReqV1,
  IWorkflowTemplateDetailResV1,
} from '../../../../api/common';

export type ProgressConfigProps = {
  defaultData?: IWorkflowTemplateDetailResV1;
  submitLoading: boolean;
  prevStep: () => void;
  submitProgressConfig: (configs: IWorkFlowStepTemplateReqV1[]) => void;
  projectName: string;
};

export type ProgressConfigItem = Required<
  Omit<IWorkFlowStepTemplateReqV1, 'type'>
>;

export type ExecProgressConfigItem = Required<
  Omit<
    IWorkFlowStepTemplateReqV1,
    'type' | 'approved_by_authorized' | 'execute_by_authorized'
  >
>;
