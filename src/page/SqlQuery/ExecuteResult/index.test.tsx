import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import ExecuteResult from '.';
import sql_query from '../../../api/sql_query';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import {
  queryResHide_1,
  queryResHide_2,
  queryResShow,
  query_res_1,
  sqlExecPlans,
  tableSchemas,
} from '../__testData__';
describe('SqlQuery/ExecuteResult', () => {
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

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = error;
  });

  const mockGetSqlResult = () => {
    const spy = jest.spyOn(sql_query, 'getSQLResult');
    spy.mockImplementation(() => {
      return resolveThreeSecond(query_res_1);
    });
    return spy;
  };

  const mockGetSqlResultHasError = () => {
    const spy = jest.spyOn(sql_query, 'getSQLResult');
    spy.mockImplementation(() => {
      return resolveErrorThreeSecond({});
    });
    return spy;
  };
  test('should match snapshot when queryRes length is not empty', () => {
    const { container, rerender } = render(
      <ExecuteResult
        queryRes={queryResShow}
        maxPreQueryRows={50}
        tableSchemas={tableSchemas}
        updateQueryResult={jest.fn()}
        sqlExecPlan={sqlExecPlans}
        closeExecPlan={jest.fn()}
        closeTableSchema={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    cleanup();
    rerender(
      <ExecuteResult
        queryRes={queryResShow}
        maxPreQueryRows={50}
        tableSchemas={[]}
        updateQueryResult={jest.fn()}
        sqlExecPlan={[]}
        closeExecPlan={jest.fn()}
        closeTableSchema={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    cleanup();
    rerender(
      <ExecuteResult
        queryRes={[]}
        maxPreQueryRows={50}
        tableSchemas={tableSchemas}
        updateQueryResult={jest.fn()}
        sqlExecPlan={[]}
        closeExecPlan={jest.fn()}
        closeTableSchema={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    cleanup();
    rerender(
      <ExecuteResult
        queryRes={[]}
        maxPreQueryRows={50}
        tableSchemas={[]}
        updateQueryResult={jest.fn()}
        sqlExecPlan={sqlExecPlans}
        closeExecPlan={jest.fn()}
        closeTableSchema={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when queryRes length is empty', () => {
    const { container, rerender } = render(
      <ExecuteResult
        queryRes={queryResHide_1}
        maxPreQueryRows={50}
        tableSchemas={[]}
        updateQueryResult={jest.fn()}
        sqlExecPlan={sqlExecPlans.map((e) => ({ ...e, hide: true }))}
        closeExecPlan={jest.fn()}
        closeTableSchema={jest.fn()}
      />
    );

    expect(container).toMatchSnapshot();
    rerender(
      <ExecuteResult
        queryRes={queryResHide_2}
        maxPreQueryRows={50}
        tableSchemas={[]}
        updateQueryResult={jest.fn()}
        sqlExecPlan={[]}
        closeExecPlan={jest.fn()}
        closeTableSchema={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when resultErrorMessage is not empty', async () => {
    const { container } = render(
      <ExecuteResult
        queryRes={queryResShow}
        maxPreQueryRows={50}
        tableSchemas={tableSchemas.map((e) => ({
          ...e,
          tableMeta: {},
          errorMessage: 'error',
        }))}
        updateQueryResult={jest.fn()}
        sqlExecPlan={sqlExecPlans}
        closeExecPlan={jest.fn()}
        closeTableSchema={jest.fn()}
      />
    );
    fireEvent.click(
      screen.getAllByText('sqlQuery.executeResult.resultTitle')[1]
    );
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getAllByText('sqlQuery.databaseTables.tabTitle')[0]);
    expect(container).toMatchSnapshot();
  });

  test('should be requested when switching the paginator', async () => {
    const mockSetQueryRes = jest.fn();
    const getSqlResult = mockGetSqlResult();
    const { container } = render(
      <ExecuteResult
        queryRes={queryResShow}
        maxPreQueryRows={16}
        tableSchemas={tableSchemas}
        updateQueryResult={mockSetQueryRes}
        sqlExecPlan={sqlExecPlans}
        closeExecPlan={jest.fn()}
        closeTableSchema={jest.fn()}
      />
    );
    expect(container.querySelector('.ant-pagination-next')).toBeInTheDocument();
    expect(container.querySelector('.ant-pagination-next')).not.toHaveClass(
      'ant-pagination-disabled'
    );
    fireEvent.click(container.querySelector('.ant-pagination-next')!);
    expect(getSqlResult).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockSetQueryRes).toBeCalledTimes(1);
    expect(mockSetQueryRes).toBeCalledWith({
      hide: false,
      errorMessage: '',
      sqlQueryId: 'query_id_1',
      resultItem: query_res_1,
    });

    jest.clearAllMocks();
    jest.clearAllTimers();

    const getSqlResultHasError = mockGetSqlResultHasError();
    fireEvent.click(container.querySelector('.ant-pagination-next')!);
    expect(getSqlResultHasError).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockSetQueryRes).toBeCalledTimes(1);
    expect(mockSetQueryRes).toBeCalledWith({
      errorMessage: 'error',
      hide: false,
      resultItem: {},
      sqlQueryId: 'query_id_1',
    });
  });

  test('should execute setQueryRes when removing tabs', () => {
    const mockSetQueryRes = jest.fn();
    const closeExecPlan = jest.fn();
    const closeTableSchema = jest.fn();
    const { container } = render(
      <ExecuteResult
        queryRes={queryResShow}
        maxPreQueryRows={16}
        tableSchemas={tableSchemas}
        updateQueryResult={mockSetQueryRes}
        sqlExecPlan={sqlExecPlans}
        closeExecPlan={closeExecPlan}
        closeTableSchema={closeTableSchema}
      />
    );

    expect(mockSetQueryRes).toBeCalledTimes(0);
    expect(
      container.querySelectorAll('.ant-tabs-tab-remove')[0]
    ).toBeInTheDocument();
    fireEvent.click(container.querySelectorAll('.ant-tabs-tab-remove')[0]);
    expect(mockSetQueryRes).toBeCalledTimes(1);
    const closeQueryRes = queryResShow[0];
    closeQueryRes.hide = true;
    expect(mockSetQueryRes).toBeCalledWith(closeQueryRes);

    fireEvent.click(container.querySelectorAll('.ant-tabs-tab-remove')[3]);
    expect(closeTableSchema).toBeCalledTimes(1);
    expect(closeTableSchema).toBeCalledWith(tableSchemas[1].id);

    fireEvent.click(container.querySelectorAll('.ant-tabs-tab-remove')[4]);
    expect(closeExecPlan).toBeCalledTimes(1);
    expect(closeExecPlan).toBeCalledWith(sqlExecPlans[0].id);
  });
});
