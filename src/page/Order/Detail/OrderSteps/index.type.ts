import { TimelineItemProps } from 'antd';
import {
  IMaintenanceTimeResV1,
  IWorkflowStepResV1,
} from '../../../../api/common.d';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
} from '../../../../api/common.enum';
import { I18nKey } from '../../../../types/common.type';

export type OrderStepsProps = {
  currentStep?: number;
  stepList: IWorkflowStepResV1[];
  currentOrderStatus?: WorkflowRecordResV2StatusEnum;
  scheduleTime?: string;
  scheduledUser?: string;
  pass: (stepId: number) => Promise<void>;
  reject: (reason: string, stepId: number) => Promise<void>;
  executing: () => Promise<void>;
  execStartTime?: string;
  execEndTime?: string;
  modifySql: () => void;
  readonly?: boolean;
  maintenanceTime?: IMaintenanceTimeResV1[];
  isRejectOrder?: boolean;
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
