import { IWorkflowStatisticsResV1 } from '../../../api/common';

export interface IDEVPanelProps {
  workflowStatistics?: IWorkflowStatisticsResV1;
  getWorkflowStatistics: () => Promise<IWorkflowStatisticsResV1 | undefined>;
  projectName: string;
}
