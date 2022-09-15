import {
  IAuditTaskResV1,
  IMaintenanceTimeResV1,
  IWorkflowResV2,
} from '../../../api/common';

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
}

export type ScheduleTimeModalProps = {
  visible: boolean;
  submit: (scheduleTime?: string) => Promise<void>;
  closeScheduleModal: () => void;
  maintenanceTime?: IMaintenanceTimeResV1[];
};
