import { ThemeProvider } from '@material-ui/styles';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import SqlInput from '.';
import { renderWithRedux } from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseInstanceSchema,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { SupportTheme } from '../../../theme';
import lightTheme from '../../../theme/light';
import sql_query from '../../../api/sql_query';
import { selectOptionByIndex } from '../../../testUtils/customQuery';

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

  const mockGetSQLQueryHistory = () => {
    const spy = jest.spyOn(sql_query, 'getSQLQueryHistory');
    spy.mockImplementation(() => {
      return resolveThreeSecond({
        sql_histories: [
          {
            sql: 'select * from user1',
          },
          {
            sql: 'select * from user2',
          },
        ],
      });
    });
    return spy;
  };

  test('should get the instance list and match the snapshot', () => {
    const { result } = renderHook(() => useForm());
    const { baseElement } = renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          dataSourceName=""
          updateDataSourceName={jest.fn()}
          updateSchemaName={jest.fn()}
          submitForm={jest.fn()}
          getSQLExecPlan={jest.fn()}
        />
      </ThemeProvider>
    );
    expect(getInstanceSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  test('should enable open history modal button and get sql exec plan button when dataSourceName is not empty', async () => {
    const { result } = renderHook(() => useForm());
    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          dataSourceName="123"
          updateDataSourceName={jest.fn()}
          updateSchemaName={jest.fn()}
          submitForm={jest.fn()}
          getSQLExecPlan={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText('sqlQuery.sqlInput.sqlHistory').parentNode
    ).not.toHaveAttribute('disabled');
    expect(
      screen.getByText('sqlQuery.sqlInput.sqlExecPlan').parentNode
    ).not.toHaveAttribute('disabled');
  });

  test('should update dataSourceName/SchemaName when user select dataSource and schema', async () => {
    const { result } = renderHook(() => useForm());
    const updateDataSourceName = jest.fn();
    const updateSchemaName = jest.fn();
    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          dataSourceName="123"
          updateDataSourceName={updateDataSourceName}
          updateSchemaName={updateSchemaName}
          submitForm={jest.fn()}
          getSQLExecPlan={jest.fn()}
        />
      </ThemeProvider>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getInstanceSchema).toBeCalledTimes(1);
    expect(getInstanceSchema).toBeCalledWith({ instance_name: '123' });

    fireEvent.mouseDown(screen.getByLabelText('sqlQuery.sqlInput.instance'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);

    expect(updateDataSourceName).toBeCalledTimes(1);
    expect(updateDataSourceName).toBeCalledWith('instance1');

    selectOptionByIndex('sqlQuery.sqlInput.database', 'schema1', 1);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(updateSchemaName).toBeCalledTimes(1);
    expect(updateSchemaName).toBeCalledWith('schema1');
  });

  test('should execute submitForm when clicking submit', async () => {
    const { result } = renderHook(() => useForm());
    const submitForm = jest.fn();
    submitForm.mockImplementation(() => resolveThreeSecond({}));
    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          dataSourceName="123"
          updateDataSourceName={jest.fn()}
          updateSchemaName={jest.fn()}
          submitForm={submitForm}
          getSQLExecPlan={jest.fn()}
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
    fireEvent.input(screen.getByTestId('sql-input-editor'), {
      target: { value: 'select * from table1' },
    });

    fireEvent.click(screen.getByText('sqlQuery.sqlInput.searchSqlResult'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(submitForm).toBeCalledTimes(1);
    expect(submitForm).toBeCalledWith({
      instanceName: 'instance1',
      instanceSchema: 'schema1',
      maxPreQueryRows: 100,
      sql: 'select * from table1',
    });
    expect(
      screen.getByText('sqlQuery.sqlInput.searchSqlResult').parentNode
    ).toHaveClass('ant-btn-loading');

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.getByText('sqlQuery.sqlInput.searchSqlResult').parentNode
    ).not.toHaveClass('ant-btn-loading');
  });

  test('should open history modal when user click open history modal button', async () => {
    const { result } = renderHook(() => useForm());
    mockGetSQLQueryHistory();
    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          dataSourceName="123"
          updateDataSourceName={jest.fn()}
          updateSchemaName={jest.fn()}
          submitForm={jest.fn()}
          getSQLExecPlan={jest.fn()}
        />
      </ThemeProvider>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('sqlQuery.sqlQueryHistory.title')
    ).not.toBeInTheDocument();
    selectOptionByIndex('sqlQuery.sqlInput.instance', 'instance1', 1);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getByText('sqlQuery.sqlInput.sqlHistory'));

    expect(
      screen.queryByText('sqlQuery.sqlQueryHistory.title')
    ).toBeInTheDocument();
  });

  test('should set sql when user click history item', async () => {
    const { result } = renderHook(() => useForm());
    mockGetSQLQueryHistory();
    renderWithRedux(
      <ThemeProvider theme={lightTheme}>
        <SqlInput
          form={result.current[0]}
          dataSourceName="123"
          updateDataSourceName={jest.fn()}
          updateSchemaName={jest.fn()}
          submitForm={jest.fn()}
          getSQLExecPlan={jest.fn()}
        />
      </ThemeProvider>
    );
    const setFieldsSpy = jest.spyOn(result.current[0], 'setFieldsValue');

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    selectOptionByIndex('sqlQuery.sqlInput.instance', 'instance1', 1);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('sqlQuery.sqlInput.sqlHistory'));

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(
      screen.getAllByText('sqlQuery.sqlQueryHistory.applySql')[0]
    );

    expect(setFieldsSpy).toBeCalledTimes(1);
    expect(setFieldsSpy).toBeCalledWith({
      sql: 'select * from user1',
    });

    expect(
      screen.getByText('sqlQuery.sqlQueryHistory.title').parentNode?.parentNode
        ?.parentNode?.parentNode
    ).toHaveStyle('display: none');
  });
});
