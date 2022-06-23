import { render, waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';
import sql_query from '../../../api/sql_query';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { sqlExecPlans } from '../../SqlQuery/__testData__';
import useSQLExecPlan from './useSQLExecPlan';

describe('useSQLExecPlan', () => {
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

  const mockGetSQLExplain = () => {
    const spy = jest.spyOn(sql_query, 'getSQLExplain');
    spy.mockImplementation(() =>
      resolveThreeSecond(
        sqlExecPlans.map((e) => ({
          sql: e.sql,
          classic_result: e.classic_result,
        }))
      )
    );
    return spy;
  };

  test('should not get sql exec plan when user call "getSQLExecPlan" method and "form" of options is empty', async () => {
    const request = mockGetSQLExplain();
    const { result } = renderHook(() => useSQLExecPlan());
    result.current.getSQLExecPlan();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(request).not.toBeCalled();
  });

  test('should get sql exec plan when user call "getSQLExecPlan" method and options include form', async () => {
    const request = mockGetSQLExplain();
    const formSpy: any = {
      validateFields: jest.fn(),
    };
    formSpy.validateFields.mockReturnValue({
      sql: 'select * from table1',
      instanceName: 'instance1',
      instanceSchema: 'schema1',
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useSQLExecPlan({ form: formSpy })
    );
    result.current.getSQLExecPlan();
    expect(formSpy.validateFields).toBeCalledTimes(1);
    expect(formSpy.validateFields).toBeCalledWith([
      'sql',
      'instanceName',
      'instanceSchema',
    ]);
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith({
      instance_name: 'instance1',
      instance_schema: 'schema1',
      sql: 'select * from table1',
    });
    expect(result.current.execPlans).toEqual([]);
    jest.runOnlyPendingTimers();
    await waitForNextUpdate();
    const res = sqlExecPlans.map((e) => ({
      ...e,
      id: `${e.sql}_instance1_schema1`,
    }));
    expect(result.current.execPlans).toEqual(res);
  });

  test('should set "hide" to true when user want to close exec plan', async () => {
    mockGetSQLExplain();
    const formSpy: any = {
      validateFields: jest.fn(),
    };
    formSpy.validateFields.mockReturnValue({
      sql: 'select * from table1',
      instanceName: 'instance1',
      instanceSchema: 'schema1',
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useSQLExecPlan({ form: formSpy })
    );
    result.current.getSQLExecPlan();
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    jest.runOnlyPendingTimers();
    await waitForNextUpdate();
    const data = cloneDeep(result.current.execPlans);
    act(() => {
      result.current.closeExecPlan(data[0].id);
    });
    data[0].hide = true;
    expect(result.current.execPlans).toEqual(data);
  });

  test('should render sqlExecPlan cad when user call "generateSQLExecPlanContent" method', async () => {
    const { result } = renderHook(() => useSQLExecPlan());
    const { container } = render(
      <div>
        {sqlExecPlans.map((e) => result.current.generateSQLExecPlanContent(e))}
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
