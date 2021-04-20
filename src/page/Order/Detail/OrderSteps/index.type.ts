import { TimelineItemProps } from 'antd';
import { IWorkflowStepResV1 } from '../../../../api/common.d';
import {
  WorkflowRecordResV1StatusEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
} from '../../../../api/common.enum';
import { I18nKey } from '../../../../types/common.type';

export type OrderStepsProps = {
  currentStep?: number;
  stepList: IWorkflowStepResV1[];
  currentOrderStatus?: WorkflowRecordResV1StatusEnum;
  pass: () => Promise<void>;
  reject: (reason: string, stepId: number) => Promise<void>;
  modifySql: () => void;
};

export type StepStateStatus = {
  [key in WorkflowStepResV1StateEnum | 'unknown']: {
    color: TimelineItemProps['color'];
  };
};

export type StepTypeStatus = {
  [key in WorkflowStepResV1TypeEnum | 'unknown']: {
    label: I18nKey;
  };
};
