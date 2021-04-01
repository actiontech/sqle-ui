import { TimelineItemProps } from 'antd';
import { IWorkflowStepResV1 } from '../../../api/common.d';
import { WorkflowStepResV1StateEnum } from '../../../api/common.enum';
import { I18nKey } from '../../../types/common.type';

export type OrderStepsProps = {
  currentStep?: number;
  stepList: IWorkflowStepResV1[];
  createUser?: string;
  createTime?: string;
  pass: () => void;
  reject: () => void;
};

export type StepStateStatus = {
  [key in WorkflowStepResV1StateEnum | 'unknown']: {
    color: TimelineItemProps['color'];
  };
};

export type StepTypeStatus = {
  unknown: {
    label: I18nKey;
  };
  [key: string]: {
    label: I18nKey;
  };
};
