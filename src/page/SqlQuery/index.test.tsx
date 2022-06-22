import { ThemeProvider } from '@material-ui/styles';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import SqlQuery from '.';
import instance from '../../api/instance';
import sql_query from '../../api/sql_query';
import { selectOptionByIndex } from '../../testUtils/customQuery';
import { renderWithRedux } from '../../testUtils/customRender';
import {
  mockUseInstance,
  mockUseInstanceSchema,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';
import lightTheme from '../../theme/light';
import { tablesName } from './DatabaseTables/__testData__';
import { instance_info, query_ids_test1, query_res_1 } from './__testData__';

describe('SqlQuery', () => {
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

  let getInstanceSpy: jest.SpyInstance;
  let getPrepareSqlQuerySpy: jest.SpyInstance;
  let getSQLResultSpy: jest.SpyInstance;
  let listTableNamesSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getInstanceSpy = mockGetInstance();
    getPrepareSqlQuerySpy = mockPrepareSQLQuery();
    getSQLResultSpy = mockGetSQLResult();
    listTableNamesSpy = mockListTableNames();
    mockUseInstance();
    mockUseInstanceSchema();
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

  test('should match snapshot', () => {
    const { container } = renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlQuery />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  const mockGetInstance = () => {
    const spy = jest.spyOn(instance, 'getInstanceV1');
    spy.mockImplementation(() => resolveThreeSecond(instance_info));
    return spy;
  };

  const mockPrepareSQLQuery = () => {
    const spy = jest.spyOn(sql_query, 'prepareSQLQuery');
    spy.mockImplementation(() => resolveThreeSecond(query_ids_test1));
    return spy;
  };

  const mockGetSQLResult = () => {
    const spy = jest.spyOn(sql_query, 'getSQLResult');
    spy.mockImplementation(() => resolveThreeSecond(query_res_1));
    return spy;
  };

  const mockListTableNames = () => {
    const spy = jest.spyOn(instance, 'listTableBySchema');
    spy.mockImplementation(() => resolveThreeSecond(tablesName));
    return spy;
  };

  test('should get query result when user submit form', async () => {
    const { container } = renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlQuery />
      </ThemeProvider>
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    selectOptionByIndex('sqlQuery.sqlInput.instance', 'instance1', 1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    selectOptionByIndex('sqlQuery.sqlInput.database', 'schema1', 1);
    expect(listTableNamesSpy).toBeCalledTimes(1);
    expect(listTableNamesSpy).toBeCalledWith({
      instance_name: 'instance1',
      schema_name: 'schema1',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByTestId('sql-input-editor'), {
      target: { value: 'select * from table1' },
    });
    fireEvent.click(screen.getByText('sqlQuery.sqlInput.searchSqlResult'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(getPrepareSqlQuerySpy).toBeCalledTimes(1);
    expect(getPrepareSqlQuerySpy).toBeCalledWith({
      instance_name: 'instance1',
      instance_schema: 'schema1',
      sql: 'select * from table1',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getSQLResultSpy).toBeCalledTimes(4);
    expect(getSQLResultSpy).nthCalledWith(1, {
      page_index: 1,
      page_size: 50,
      query_id: 'query_id1',
    });
    expect(getSQLResultSpy).nthCalledWith(2, {
      page_index: 1,
      page_size: 50,
      query_id: 'query_id2',
    });
    expect(getSQLResultSpy).nthCalledWith(3, {
      page_index: 1,
      page_size: 50,
      query_id: 'query_id3',
    });
    expect(getSQLResultSpy).nthCalledWith(4, {
      page_index: 1,
      page_size: 50,
      query_id: 'query_id4',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should close query result when user click close icon', async () => {
    const { container } = renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlQuery />
      </ThemeProvider>
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    selectOptionByIndex('sqlQuery.sqlInput.instance', 'instance1', 1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    selectOptionByIndex('sqlQuery.sqlInput.database', 'schema1', 1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.input(screen.getByTestId('sql-input-editor'), {
      target: { value: 'select * from table1' },
    });
    fireEvent.click(screen.getByText('sqlQuery.sqlInput.searchSqlResult'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(container.querySelectorAll('.ant-tabs-tab-remove')[0]);

    expect(container).toMatchSnapshot();
  });

  test('should get max query rows when user select a dataSource', async () => {
    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlQuery />
      </ThemeProvider>
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByLabelText('sqlQuery.sqlInput.returnLength')).toHaveValue(
      '100'
    );
    selectOptionByIndex('sqlQuery.sqlInput.instance', 'instance1', 1);
    expect(getInstanceSpy).toBeCalledTimes(1);
    expect(getInstanceSpy).toBeCalledWith({
      instance_name: 'instance1',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByLabelText('sqlQuery.sqlInput.returnLength')).toHaveValue(
      '50'
    );
  });
});
