import { GlobalRouterItemKeyLiteral } from '../../types/router.type';
import UserCenter from './UserCenter';

export type UserCenterActiveTabKey = Extract<
  GlobalRouterItemKeyLiteral,
  'user' | 'role' | 'userGroup'
>;

export default UserCenter;
