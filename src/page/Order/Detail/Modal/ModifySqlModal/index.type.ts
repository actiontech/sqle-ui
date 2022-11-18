import { IAuditTaskResV1 } from '../../../../../api/common.d';
import { WorkflowResV1ModeEnum } from '../../../../../api/common.enum';
import { SqlInfoFormFields } from '../../../Create/SqlInfoForm/index.type';

export type ModifySqlModalProps = {
  cancel: () => void;
  submit: (
    tasks: SqlInfoFormFields,
    currentTabIndex: number,
    currentTabKey: string
  ) => Promise<void>;
  visible: boolean;
  currentOrderTasks?: IAuditTaskResV1[];
  sqlMode: WorkflowResV1ModeEnum;
};
