import { IWorkflowStatisticsResV1 } from '../../../api/common';

export interface IDBAPanelProps {
  workflowStatistics?: IWorkflowStatisticsResV1;
  getWorkflowStatistics: () => void;
  projectName: string;
}
