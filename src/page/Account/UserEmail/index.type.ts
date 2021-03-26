import { IUserDetailResV1 } from '../../../api/common.d';

export type UserEmailProps = {
  refreshUserInfo: () => void;
  userInfo?: IUserDetailResV1;
};

export interface UseInputChangeParams extends UserEmailProps {
  closeEditEmail: () => void;
  setInputValue: (value: string) => void;
}
