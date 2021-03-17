import { IGetUserListV1Params } from '../../../api/user/index.d';

export type UserListFilter = Omit<
  IGetUserListV1Params,
  'page_size' | 'page_index'
>;
