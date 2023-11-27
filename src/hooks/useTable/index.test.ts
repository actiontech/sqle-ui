import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import useTable from '.';

jest.mock('antd/lib/form/Form', () => {
  return {
    useForm: jest.fn(),
  };
});

describe('useTable', () => {
  let getFieldsValueMock: jest.Mock;
  let resetFieldsMock: jest.Mock;

  beforeEach(() => {
    getFieldsValueMock = jest.fn();
    resetFieldsMock = jest.fn();
    (useForm as jest.Mock).mockReturnValue([
      {
        getFieldsValue: getFieldsValueMock,
        resetFields: resetFieldsMock,
      },
    ]);
  });

  afterEach(() => {
    getFieldsValueMock.mockClear();
    resetFieldsMock.mockClear();
  });

  test('should have default value when params is undefined', () => {
    const { result } = renderHook(() => useTable());
    expect(result.current.collapse).toBe(true);
    expect(result.current.pagination).toEqual({ pageIndex: 1, pageSize: 10 });
    expect(result.current.filterInfo).toEqual({});
  });

  test('should set default value to params when params is valid', () => {
    const { result } = renderHook(() =>
      useTable({
        defaultFilterFormCollapse: false,
        defaultFilterInfo: { a: 1, b: 2 },
        defaultPageIndex: 10,
        defaultPageSize: 100,
      })
    );
    expect(result.current.collapse).toBe(false);
    expect(result.current.pagination).toEqual({ pageIndex: 10, pageSize: 100 });
    expect(result.current.filterInfo).toEqual({ a: 1, b: 2 });
  });

  test('should set filter info to form values when call submitFilter function', () => {
    const { result } = renderHook(() =>
      useTable({
        defaultFilterInfo: { test: '1' },
      })
    );
    getFieldsValueMock.mockReturnValueOnce({ newTest: '2' });
    expect(result.current.filterInfo).toEqual({ test: '1' });
    act(() => {
      result.current.submitFilter();
    });
    expect(getFieldsValueMock).toBeCalledTimes(1);
    expect(result.current.filterInfo).toEqual({ newTest: '2' });
  });

  test('should reset filter info to empty object when call resetFilter function', () => {
    const { result } = renderHook(() =>
      useTable({
        defaultFilterInfo: { test: '1' },
      })
    );
    expect(result.current.filterInfo).toEqual({ test: '1' });
    act(() => {
      result.current.resetFilter();
    });
    expect(resetFieldsMock).toBeCalledTimes(1);
    expect(result.current.filterInfo).toEqual({});
  });

  test('only change pageSize or pageIndex when new page size or page index is diff between old data', () => {
    const { result } = renderHook(() =>
      useTable({
        defaultPageIndex: 1,
        defaultPageSize: 10,
      })
    );
    expect(result.current.pagination).toEqual({ pageIndex: 1, pageSize: 10 });
    act(() => {
      result.current.tableChange(
        { pageSize: 10, current: 1 },
        {},
        {},
        {} as any
      );
    });
    expect(result.current.pagination).toEqual({ pageIndex: 1, pageSize: 10 });

    act(() => {
      result.current.tableChange(
        { pageSize: 20, current: 1 },
        {},
        {},
        {} as any
      );
    });
    expect(result.current.pagination).toEqual({ pageIndex: 1, pageSize: 20 });

    act(() => {
      result.current.tableChange(
        { pageSize: 20, current: 11 },
        {},
        {},
        {} as any
      );
    });
    expect(result.current.pagination).toEqual({ pageIndex: 11, pageSize: 20 });

    act(() => {
      result.current.tableChange(
        { pageSize: 200, current: 111 },
        {},
        {},
        {} as any
      );
    });
    expect(result.current.pagination).toEqual({
      pageIndex: 1,
      pageSize: 200,
    });
  });
});
