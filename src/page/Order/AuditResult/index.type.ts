import { FormInstance, TagProps } from 'antd';
import {
  IAuditTaskResV1,
  IGetWorkflowTasksItemV2,
  IMaintenanceTimeResV1,
} from '../../../api/common';
import {
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowRecordResV2StatusEnum,
} from '../../../api/common.enum';
import { IGetAuditTaskSQLsV2Params } from '../../../api/task/index.d';
import { I18nKey } from '../../../types/common.type';

export type AuditResultProps = {
  taskId?: number;
  passRate?: number;
  auditScore?: number;
  instanceSchema?: string;
  updateTaskRecordTotalNum?: (taskId: string, sqlNumber: number) => void;
  projectName: string;
  mode?: 'order' | 'auditRecordCreate' | 'auditRecordDetail';
  getResultCallBack?: () => void
};

export interface AuditResultCollectionProps {
  taskInfos: IAuditTaskResV1[];
  auditResultActiveKey: string;
  setAuditResultActiveKey: React.Dispatch<React.SetStateAction<string>>;
  updateTaskRecordTotalNum?: (taskId: string, sqlNumber: number) => void;
  showOverview?: boolean;
  workflowId?: string;
  refreshOrder?: () => void;
  refreshOverviewFlag?: boolean;
  orderStatus?: WorkflowRecordResV2StatusEnum;
  getOverviewListSuccessHandle?: (list: IGetWorkflowTasksItemV2[]) => void;
  projectName: string;
}

export type ScheduleTimeModalProps = {
  visible: boolean;
  submit: (scheduleTime?: string | undefined) => Promise<void>;
  closeScheduleModal: () => void;
  maintenanceTime?: IMaintenanceTimeResV1[];
};

export type InstanceTasksStatusType = {
  [key in GetWorkflowTasksItemV2StatusEnum | 'unknown']: {
    color: TagProps['color'];
    label: I18nKey;
  };
};

export type FilterFormProps = {
  form: FormInstance<OrderAuditResultFilterFields>;
  submit: () => void;
  reset: () => void;
  mode: AuditResultProps['mode'];
};

export type OrderAuditResultFilterFields = Omit<
  IGetAuditTaskSQLsV2Params,
  'page_index' | 'page_size' | 'task_id'
>;

export type WorkflowOverviewProps = {
  workflowName: string;
};

export type MaintenanceTimeInfoType = Array<{
  instanceName: string;
  maintenanceTime: IMaintenanceTimeResV1[];
}>;

export type RenderExecuteSqlProps = {
  sql?: string;
  rows?: number;
};
