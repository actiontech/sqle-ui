import { IAuditTaskResV1 } from '../../../../../api/common.d';

export type ModifySqlModalProps = {
  cancel: () => void;
  submit: (task: IAuditTaskResV1) => void;
  visible: boolean;
  currentOrderTask?: IAuditTaskResV1;
};
