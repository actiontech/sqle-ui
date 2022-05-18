import SqlQueryHistory from '.';
import sql_query from '../../../../../api/sql_query';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
describe('SqlQueryHistory', () => {
  let getSQLQueryHistorySpy: jest.SpyInstance;
  let mockApplyHistorySql = jest.fn();
  let mockCloseModal = jest.fn();
  const instanceName = 'dble';
  const page_size = 20;
  const page_index = 1;

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

  beforeEach(() => {
    getSQLQueryHistorySpy = mockGetSQLQueryHistory();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  test('should init sql history list when visible is truly', async () => {
    const { baseElement, rerender } = render(
      <SqlQueryHistory
        visible={false}
        applyHistorySql={mockApplyHistorySql}
        close={mockCloseModal}
        instanceName={instanceName}
      />
    );
    expect(getSQLQueryHistorySpy).toBeCalledTimes(0);

    rerender(
      <SqlQueryHistory
        visible={true}
        applyHistorySql={mockApplyHistorySql}
        close={mockCloseModal}
        instanceName={instanceName}
      />
    );
    expect(getSQLQueryHistorySpy).toBeCalledTimes(1);
    expect(getSQLQueryHistorySpy).toBeCalledWith({
      instance_name: instanceName,
      page_index,
      page_size,
    });

    expect(
      screen.getByText('sqlQuery.sqlQueryHistory.filterSqlHistory').parentNode
    ).toHaveClass('ant-btn-loading');

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('sqlQuery.sqlQueryHistory.filterSqlHistory').parentNode
    ).not.toHaveClass('ant-btn-loading');
    expect(baseElement).toMatchSnapshot();
  });

  test('should filter sql history when click search button', async () => {
    const { baseElement } = render(
      <SqlQueryHistory
        visible={true}
        applyHistorySql={mockApplyHistorySql}
        close={mockCloseModal}
        instanceName={instanceName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.input(baseElement.querySelector('#sql_history_filter')!, {
      target: {
        value: 'filter',
      },
    });
    fireEvent.click(
      screen.getByText('sqlQuery.sqlQueryHistory.filterSqlHistory')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(getSQLQueryHistorySpy).toBeCalledTimes(2);
    expect(getSQLQueryHistorySpy).toBeCalledWith({
      instance_name: instanceName,
      filter_fuzzy_search: 'filter',
      page_index,
      page_size,
    });
  });

  test('should be executed applyHistorySql when the apply button is clicked', async () => {
    const { baseElement } = render(
      <SqlQueryHistory
        visible={true}
        applyHistorySql={mockApplyHistorySql}
        close={mockCloseModal}
        instanceName={instanceName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockApplyHistorySql).toBeCalledTimes(0);
    expect(mockCloseModal).toBeCalledTimes(0);

    fireEvent.click(baseElement.querySelector('#apply-btn-0')!);
    expect(mockApplyHistorySql).toBeCalledTimes(1);
    expect(mockApplyHistorySql).toBeCalledWith('select * from user1');

    fireEvent.click(baseElement.querySelector('#apply-btn-1')!);
    expect(mockApplyHistorySql).toBeCalledTimes(2);
    expect(mockApplyHistorySql).toBeCalledWith('select * from user2');

    fireEvent.click(screen.getByText('common.close'));
    expect(mockCloseModal).toBeCalledTimes(1);
  });
});
