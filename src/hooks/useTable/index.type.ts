import { Dictionary } from '../../types/common.type';

export type UseTableOption = {
  defaultPageIndex?: number;
  defaultPageSize?: number;
  defaultFilterInfo?: Dictionary;
};

export type TablePagination = {
  pageIndex: number;
  pageSize: number;
};
