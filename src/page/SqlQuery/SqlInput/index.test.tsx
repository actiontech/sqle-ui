import { ThemeProvider } from '@material-ui/styles';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import SqlInput from '.';
import instance from '../../../api/instance';
import { renderWithRedux } from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseInstanceSchema,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { SupportTheme } from '../../../theme';
import lightTheme from '../../../theme/light';
import { instance_info, query_ids_test1, query_res_1 } from '../__testData__';
import sql_query from '../../../api/sql_query';

describe('sqlQuery/sqlInput', () => {
  let getInstanceSpy: jest.SpyInstance;
  let getInstanceSchema: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { theme: SupportTheme.LIGHT } });
    getInstanceSpy = mockUseInstance();
    getInstanceSchema = mockUseInstanceSchema();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetInstanceByName = () => {
    const spy = jest.spyOn(instance, 'getInstanceV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(instance_info);
    });
    return spy;
  };

  const mockPrePareSqlQuery = () => {
    const spy = jest.spyOn(sql_query, 'prepareSQLQuery');
    spy.mockImplementation(() => {
      return resolveThreeSecond(query_ids_test1);
    });
    return spy;
  };
  const mockGetSqlResult = () => {
    const spy = jest.spyOn(sql_query, 'getSQLResult');
    spy.mockImplementation(() => {
      return resolveThreeSecond(query_res_1);
    });
    return spy;
  };

  const mockPrePareSqlQueryHasError = () => {
    const spy = jest.spyOn(sql_query, 'prepareSQLQuery');
    spy.mockImplementation(() => {
      return resolveErrorThreeSecond({});
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

  test('should get the instance list and match the snapshot', () => {
    const { result } = renderHook(() => useForm());
    const setQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    const { baseElement } = renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          setQueryRes={setQueryRes}
          setResultErrorMessage={setResultErrorMessage}
        />
      </ThemeProvider>
    );
    expect(setQueryRes).toBeCalledTimes(0);
    expect(setResultErrorMessage).toBeCalledTimes(0);
    expect(getInstanceSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  test('should disabled open history modal button when instance is empty', async () => {
    const { result } = renderHook(() => useForm());
    const setQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    mockGetInstanceByName();
    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          setQueryRes={setQueryRes}
          setResultErrorMessage={setResultErrorMessage}
        />
      </ThemeProvider>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('sqlQuery.sqlInput.sqlHistory').parentNode
    ).toHaveAttribute('disabled');
    fireEvent.mouseDown(screen.getByLabelText('sqlQuery.sqlInput.instance'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('sqlQuery.sqlInput.sqlHistory').parentNode
    ).not.toHaveAttribute('disabled');
  });

  test('should be get instanceSchema list and set maxPreQueryRows value when select instanceName', async () => {
    const { result } = renderHook(() => useForm());
    const setQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    const getInstanceByName = mockGetInstanceByName();
    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          setQueryRes={setQueryRes}
          setResultErrorMessage={setResultErrorMessage}
        />
      </ThemeProvider>
    );
    expect(getInstanceByName).toBeCalledTimes(0);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(screen.getByLabelText('sqlQuery.sqlInput.instance'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getInstanceByName).toBeCalledTimes(1);
    expect(getInstanceSchema).toBeCalledTimes(1);
    expect(screen.getByLabelText('sqlQuery.sqlInput.returnLength')).toHaveValue(
      instance_info.sql_query_config?.max_pre_query_rows!.toString()
    );
  });

  test('should execute getSqlQueryResultList when clicking submit', async () => {
    const { result } = renderHook(() => useForm());
    const setQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    mockGetInstanceByName();
    const prePareSqlQuery = mockPrePareSqlQuery();
    const getSqlResult = mockGetSqlResult();

    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          setQueryRes={setQueryRes}
          setResultErrorMessage={setResultErrorMessage}
        />
      </ThemeProvider>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(screen.getByLabelText('sqlQuery.sqlInput.instance'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(screen.getByLabelText('sqlQuery.sqlInput.database'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const schemaOptions = screen.getAllByText('schema1');
    fireEvent.click(schemaOptions[1]);

    fireEvent.click(screen.getByText('sqlQuery.sqlInput.searchSqlResult'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(prePareSqlQuery).toBeCalledTimes(1);
    expect(
      screen.getByText('sqlQuery.sqlInput.searchSqlResult').parentNode
    ).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getSqlResult).toBeCalledTimes(query_ids_test1.query_ids?.length!);
    expect(setQueryRes).toBeCalledTimes(1);
    expect(setResultErrorMessage).toBeCalledTimes(1);
    expect(
      screen.getByText('sqlQuery.sqlInput.searchSqlResult').parentNode
    ).not.toHaveClass('ant-btn-loading');
  });

  test('should show error message when prepare sql has error', async () => {
    const { result } = renderHook(() => useForm());
    const setQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    mockGetInstanceByName();
    const prePareSqlQueryHasError = mockPrePareSqlQueryHasError();
    const getSqlResult = mockGetSqlResult();

    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          setQueryRes={setQueryRes}
          setResultErrorMessage={setResultErrorMessage}
        />
      </ThemeProvider>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(screen.getByLabelText('sqlQuery.sqlInput.instance'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(screen.getByLabelText('sqlQuery.sqlInput.database'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const schemaOptions = screen.getAllByText('schema1');
    fireEvent.click(schemaOptions[1]);

    fireEvent.click(screen.getByText('sqlQuery.sqlInput.searchSqlResult'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(prePareSqlQueryHasError).toBeCalledTimes(1);
    expect(
      screen.getByText('sqlQuery.sqlInput.searchSqlResult').parentNode
    ).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(setResultErrorMessage).toBeCalledTimes(1);
    expect(setQueryRes).toBeCalledTimes(0);
    expect(getSqlResult).toBeCalledTimes(0);
    expect(
      screen.getByText('sqlQuery.sqlInput.searchSqlResult').parentNode
    ).not.toHaveClass('ant-btn-loading');
  });
  test('should show error message when get sql result has error', async () => {
    const { result } = renderHook(() => useForm());
    const setQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    mockGetInstanceByName();
    const prePareSqlQuery = mockPrePareSqlQuery();
    const getSqlResultHasError = mockGetSqlResultHasError();

    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          setQueryRes={setQueryRes}
          setResultErrorMessage={setResultErrorMessage}
        />
      </ThemeProvider>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(screen.getByLabelText('sqlQuery.sqlInput.instance'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(screen.getByLabelText('sqlQuery.sqlInput.database'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const schemaOptions = screen.getAllByText('schema1');
    fireEvent.click(schemaOptions[1]);

    fireEvent.click(screen.getByText('sqlQuery.sqlInput.searchSqlResult'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(prePareSqlQuery).toBeCalledTimes(1);
    expect(
      screen.getByText('sqlQuery.sqlInput.searchSqlResult').parentNode
    ).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getSqlResultHasError).toBeCalledTimes(
      query_ids_test1.query_ids?.length!
    );
    expect(setResultErrorMessage).toBeCalledTimes(1);
    expect(setQueryRes).toBeCalledTimes(0);
    expect(
      screen.getByText('sqlQuery.sqlInput.searchSqlResult').parentNode
    ).not.toHaveClass('ant-btn-loading');
  });
});
