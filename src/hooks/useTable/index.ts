import { TableProps } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { Dictionary } from '../../types/common.type';
import { TablePagination, UseTableOption } from './index.type';
import { SorterResult } from 'antd/lib/table/interface';
import { isEqual } from 'lodash';

/**
 * 注意：当使用当前hooks, 且 Table 有筛选条件信息，Table 的 current, pageSize 需要可控，对应的值为 pagination.pageIndex, pagination.pageSize
    示例：src/page/DataSource/DataSourceList/index.tsx
    如此是为了解决，筛选条件，表格排序，设置分页变换时，index, size 为期望的数据
 */
const useTable = <T = Dictionary>(option?: UseTableOption) => {
  const {
    defaultPageSize = 10,
    defaultPageIndex = 1,
    defaultFilterInfo = {},
    defaultFilterFormCollapse = true,
  } = option ?? {};

  const [form] = useForm<T>();
  const [collapse, collapseChange] = useState(defaultFilterFormCollapse);
  const [sorterInfo, setSorterInfo] = useState<
    SorterResult<any> | SorterResult<any>[]
  >();

  const [pagination, setPagination] = React.useState<TablePagination>({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  });
  const [filterInfo, updateFilterInfo] = React.useState<T>(
    defaultFilterInfo as any
  );

  const setFilterInfo = React.useCallback((values: T) => {
      if (!isEqual(values, filterInfo)) {
        setPagination((prevPage) => {
          return {
            pageIndex: 1,
            pageSize: prevPage.pageSize,
          };
        });
      }
      updateFilterInfo(values);
    },
    [filterInfo]);

  /**
   * TODO:
   * form resetFields will set value to initValue. but setFilterInfo will always set filterInfo to empty object
   */
  const resetFilter = React.useCallback(() => {
    form.resetFields();
    setFilterInfo({} as any);
    setPagination({
      pageIndex: defaultPageIndex,
      pageSize: pagination.pageSize,
    });
  }, [form, setFilterInfo, setPagination, defaultPageIndex, pagination]);

  const submitFilter = React.useCallback(() => {
    const values = form.getFieldsValue();
    setFilterInfo(values);
  }, [form, setFilterInfo]);

  const tableChange = React.useCallback<Required<TableProps<any>>["onChange"]>(
    (newPagination, _, sorter) => {
      setSorterInfo(sorter);
      let paginationParams = {
        pageIndex: defaultPageIndex,
        pageSize: newPagination.pageSize ?? defaultPageSize,
      };
      if (newPagination.pageSize && newPagination.pageSize !== pagination.pageSize) {
        paginationParams.pageSize = newPagination.pageSize;
        setPagination(paginationParams);
        return;
      }
      if (
        newPagination.current &&
        newPagination.current !== pagination.pageIndex
      ) {
        paginationParams.pageIndex = newPagination.current;
      }
      setPagination(paginationParams);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.pageIndex, pagination.pageSize]
  );

  return {
    filterForm: form,
    filterInfo,
    pagination,
    collapse,
    collapseChange,
    setPagination,
    setFilterInfo,
    submitFilter,
    resetFilter,
    tableChange,
    sorterInfo,
  };
};

export default useTable;
