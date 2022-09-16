import { TagProps } from 'antd';
import {
  IAuditTaskResV1,
  IMaintenanceTimeResV1,
  IWorkflowResV2,
} from '../../../api/common';
import { GetWorkflowTasksItemV1StatusEnum } from '../../../api/common.enum';
import { I18nKey } from '../../../types/common.type';

export type AuditResultProps = {
  taskId?: number;
  passRate?: number;
  auditScore?: number;
  instanceSchema?: string;
  updateTaskRecordTotalNum?: (taskId: string, sqlNumber: number) => void;
};

export interface AuditResultCollectionProps {
  taskInfos: IAuditTaskResV1[];
  auditResultActiveKey: string;
  setAuditResultActiveKey: React.Dispatch<React.SetStateAction<string>>;
  updateTaskRecordTotalNum?: (taskId: string, sqlNumber: number) => void;
  showOverview?: boolean;
  workflowId?: string;
  refreshOrder?: () => Promise<IWorkflowResV2 | undefined>;
  setIsExistScheduleTask?: React.Dispatch<React.SetStateAction<boolean>>;
  refreshOverviewFlag?: boolean;
}

export type ScheduleTimeModalProps = {
  visible: boolean;
  submit: (scheduleTime?: string | undefined) => Promise<void>;
  closeScheduleModal: () => void;
  maintenanceTime?: IMaintenanceTimeResV1[];
};

export type InstanceTasksStatusType = {
  [key in GetWorkflowTasksItemV1StatusEnum | 'unknown']: {
    color: TagProps['color'];
    label: I18nKey;
  };
};
