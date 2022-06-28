import { render, waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';
import instance from '../../../api/instance';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { tableSchemas } from '../../SqlQuery/__testData__';
import useTableSchema from './useTableSchema';

describe('useTableSchema', () => {
  // eslint-disable-next-line no-console
  const error = console.error;

  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // eslint-disable-next-line no-console
    (console.error as any).mockImplementation((message: any) => {
      if (
        message.includes('Each child in a list should have a unique "key" prop')
      ) {
        return;
      }
      error(message);
    });
  });
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error = error;
  });

  const mockGetTableSchemas = () => {
    const spy = jest.spyOn(instance, 'getTableMetadata');
    spy.mockImplementation(() => resolveThreeSecond(tableSchemas[0].tableMeta));
    return spy;
  };

  test('should not get table schema when user call "getTableSchemas" method and "dataSourceName" and "schemaName" of options is empty', async () => {
    const request = mockGetTableSchemas();
    const { result } = renderHook(() => useTableSchema());
    result.current.getTableSchemas('123');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(request).not.toBeCalled();
  });

  test('should get table schemas when user call "getTableSchemas" method and options include dataSourceName and schemaName', async () => {
    const request = mockGetTableSchemas();
    const { result } = renderHook(() =>
      useTableSchema({ dataSourceName: 'source1', schemaName: 'schema1' })
    );
    result.current.getTableSchemas('table1');

    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith({
      instance_name: 'source1',
      schema_name: 'schema1',
      table_name: 'table1',
    });
    expect(result.current.tableSchemas).toEqual([]);
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    const res = cloneDeep(tableSchemas[0]);
    res.id = 'table1-schema1-source1';
    expect(result.current.tableSchemas).toEqual([res]);
  });

  test('should remove table schema when user want to close table schema', async () => {
    mockGetTableSchemas();
    const { result } = renderHook(() =>
      useTableSchema({ dataSourceName: 'source1', schemaName: 'schema1' })
    );
    result.current.getTableSchemas('table1');
    expect(result.current.tableSchemas).toEqual([]);
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    const res = cloneDeep(tableSchemas[0]);
    res.id = 'table1-schema1-source1';
    expect(result.current.tableSchemas).toEqual([res]);
    act(() => {
      result.current.closeTableSchema(res.id);
    });
    expect(result.current.tableSchemas).toEqual([]);
  });

  test('should render table schema card when user call "generateTableSchemaContent" method', async () => {
    const { result } = renderHook(() => useTableSchema());
    const data = cloneDeep(tableSchemas);
    data[1].errorMessage = 'error';
    const { container } = render(
      <div>{data.map((e) => result.current.generateTableSchemaContent(e))}</div>
    );
    expect(container).toMatchSnapshot();
  });

  test('should render info message when table meta data include "message" field', async () => {
    const { result } = renderHook(() => useTableSchema());
    const data = cloneDeep(tableSchemas);
    data[1].errorMessage = 'error';
    data[1].tableMeta.message = '123';
    const { container } = render(
      <div>{data.map((e) => result.current.generateTableSchemaContent(e))}</div>
    );
    expect(container).toMatchSnapshot();
  });
});
