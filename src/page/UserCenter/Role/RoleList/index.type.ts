import { IGetRoleListV2Params } from '../../../../api/role/index.d';

export type RoleListFilter = Omit<
  IGetRoleListV2Params,
  'page_size' | 'page_index'
>;
