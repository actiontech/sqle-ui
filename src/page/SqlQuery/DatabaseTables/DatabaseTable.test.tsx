import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import instance from '../../../api/instance';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import DatabaseTables from './DatabaseTables';
import { tablesName } from './__testData__';

describe('DatabaseTable', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockListTables();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockListTables = () => {
    const spy = jest.spyOn(instance, 'listTableBySchema');
    spy.mockImplementation(() => resolveThreeSecond(tablesName));
    return spy;
  };

  it('should match snapshot', async () => {
    const listTablesSpy = mockListTables();
    const { container, rerender } = render(
      <DatabaseTables getTableSchema={jest.fn()} />
    );
    expect(listTablesSpy).not.toBeCalled();
    rerender(
      <DatabaseTables
        getTableSchema={jest.fn()}
        dataSourceName="1"
        schemaName="2"
      />
    );
    expect(listTablesSpy).toBeCalledTimes(1);
    expect(listTablesSpy).toBeCalledWith({
      instance_name: '1',
      schema_name: '2',
    });

    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render empty box when request return empty array', async () => {
    const listTablesSpy = mockListTables();
    listTablesSpy.mockImplementation(() => resolveThreeSecond([]));
    const { container } = render(
      <DatabaseTables
        getTableSchema={jest.fn()}
        dataSourceName="1"
        schemaName="1"
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  it('should call "getTableSchema" of props when click table name', async () => {
    const getTableSchemaSpy = jest.fn();
    getTableSchemaSpy.mockImplementation(() => resolveThreeSecond([]));
    render(
      <DatabaseTables
        getTableSchema={getTableSchemaSpy}
        dataSourceName="1"
        schemaName="1"
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText(tablesName[0].name));
    expect(getTableSchemaSpy).toBeCalledTimes(1);
    expect(getTableSchemaSpy).toBeCalledWith('audit_plan_report_sqls_v2');
    fireEvent.click(screen.getByText(tablesName[1].name));
    expect(getTableSchemaSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText(tablesName[1].name));
    expect(getTableSchemaSpy).toBeCalledTimes(2);
    expect(getTableSchemaSpy).nthCalledWith(2, 'audit_plan_reports_v2');
  });
});
