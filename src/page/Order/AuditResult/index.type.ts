import { FormInstance, TagProps } from 'antd';
import {
  IAuditTaskResV1,
  IGetWorkflowTasksItemV1,
  IMaintenanceTimeResV1,
  IWorkflowResV1,
} from '../../../api/common';
import {
  GetWorkflowTasksItemV1StatusEnum,
  WorkflowRecordResV1StatusEnum,
} from '../../../api/common.enum';
import { IGetAuditTaskSQLsV1Params } from '../../../api/task/index.d';
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
  workflowName?: string;
  refreshOrder?: () => Promise<IWorkflowResV1 | undefined>;
  refreshOverviewFlag?: boolean;
  orderStatus?: WorkflowRecordResV1StatusEnum;
  getOverviewListSuccessHandle?: (list: IGetWorkflowTasksItemV1[]) => void;
  projectName: string;
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

export type FilterFormProps = {
  form: FormInstance<OrderAuditResultFilterFields>;
  submit: () => void;
  reset: () => void;
};

export type OrderAuditResultFilterFields = Omit<
  IGetAuditTaskSQLsV1Params,
  'page_index' | 'page_size' | 'task_id'
>;

export type WorkflowOverviewProps = {
  workflowName: string;
};

export type MaintenanceTimeInfoType = Array<{
  instanceName: string;
  maintenanceTime: IMaintenanceTimeResV1[];
}>;
