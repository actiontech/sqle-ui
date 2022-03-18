import { IUserDetailResV1 } from '../../../api/common';

export type WechatProps = {
  refreshUserInfo: () => void;
  userInfo?: IUserDetailResV1;
};
