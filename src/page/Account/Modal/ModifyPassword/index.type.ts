import { ModalName } from '../../../../data/ModalName';

export type ModifyPasswordProps = {
  visible: boolean;
  setModalStatus: (modalName: ModalName, status: boolean) => void;
};

export type ModifyPasswordFormFields = {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
};
