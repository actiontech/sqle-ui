import { IAuditTaskResV1 } from '../../../../../api/common.d';

export type ModifySqlModalProps = {
  cancel: () => void;
  submit: (taskId: number, passRate: number) => void;
  visible: boolean;
  currentOrderTask?: IAuditTaskResV1;
};
