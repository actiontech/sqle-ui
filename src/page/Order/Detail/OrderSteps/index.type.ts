import { TimelineItemProps } from 'antd';
import { IWorkflowStepResV2 } from '../../../../api/common.d';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
} from '../../../../api/common.enum';
import { I18nKey } from '../../../../types/common.type';
import { MaintenanceTimeInfoType } from '../../AuditResult/index.type';

export type OrderStepsProps = {
  currentStep?: number;
  stepList: IWorkflowStepResV2[];
  currentOrderStatus?: WorkflowRecordResV2StatusEnum;
  scheduleTime?: string;
  scheduledUser?: string;
  pass: (stepId: number) => Promise<void>;
  reject: (reason: string, stepId: number) => Promise<void>;
  executing: () => Promise<void>;
  complete: () => Promise<void>;
  terminate: () => Promise<void>;
  execStartTime?: string;
  execEndTime?: string;
  modifySql: () => void;
  readonly?: boolean;
  maintenanceTimeInfo?: MaintenanceTimeInfoType;
  canRejectOrder?: boolean;
  tasksStatusNumber?: TasksStatusNumberType;
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

export type TasksStatusNumberType = {
  success: number;
  failed: number;
  executing: number;
};

export type ActionNodeType = {
  modifySqlNode: JSX.Element;
  sqlReviewNode: JSX.Element;
  batchSqlExecuteNode: JSX.Element;
  rejectFullNode: JSX.Element;
  maintenanceTimeInfoNode: JSX.Element;
  finishNode: JSX.Element;
  terminateNode: JSX.Element;
};
