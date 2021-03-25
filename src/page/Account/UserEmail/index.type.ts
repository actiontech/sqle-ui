import { IUserDetailResV1 } from '../../../api/common.d';

export type UserEmailProps = {
  refreshUserInfo: () => void;
  userInfo?: IUserDetailResV1;
};
