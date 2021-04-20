import { IWorkflowRecordResV1 } from '../../../../../api/common.d';

export type OrderHistoryProps = {
  history: IWorkflowRecordResV1[];
  visible: boolean;
  close: () => void;
};
