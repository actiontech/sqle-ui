import { IAuditTaskResV1 } from '../../../../../api/common.d';
import { WorkflowResV2ModeEnum } from '../../../../../api/common.enum';

export type ModifySqlModalProps = {
  cancel: () => void;
  submit: (tasks: IAuditTaskResV1[]) => void;
  visible: boolean;
  currentOrderTasks?: IAuditTaskResV1[];
  sqlMode: WorkflowResV2ModeEnum;
};
