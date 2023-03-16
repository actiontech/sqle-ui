import { IUserDetailResV1 } from '../../../api/common';

export type UserPhoneProps = {
  refreshUserInfo: () => void;
  userInfo?: IUserDetailResV1;
};
