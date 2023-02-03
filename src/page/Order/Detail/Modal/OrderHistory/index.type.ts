import { IWorkflowRecordResV2 } from '../../../../../api/common.d';

export type OrderHistoryProps = {
  history: IWorkflowRecordResV2[];
  visible: boolean;
  close: () => void;
};
