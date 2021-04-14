import { TimelineItemProps } from 'antd';
import { IWorkflowStepResV1 } from '../../../../api/common.d';
import {
  WorkflowStepResV1StateEnum,
  WorkFlowStepTemplateReqV1TypeEnum,
} from '../../../../api/common.enum';
import { I18nKey } from '../../../../types/common.type';

export type OrderStepsProps = {
  currentStep?: number;
  stepList: IWorkflowStepResV1[];
  createUser?: string;
  createTime?: string;
  pass: () => Promise<void>;
  reject: (reason: string) => Promise<void>;
};

export type StepStateStatus = {
  [key in WorkflowStepResV1StateEnum | 'unknown']: {
    color: TimelineItemProps['color'];
  };
};

export type StepTypeStatus = {
  [key in WorkFlowStepTemplateReqV1TypeEnum | 'unknown']: {
    label: I18nKey;
  };
};
