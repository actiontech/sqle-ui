import { IGetRoleListV1Params } from '../../../../api/role/index.d';

export type RoleListFilter = Omit<
  IGetRoleListV1Params,
  'page_size' | 'page_index'
>;
