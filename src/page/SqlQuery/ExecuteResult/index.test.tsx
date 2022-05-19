import { fireEvent, render, waitFor } from '@testing-library/react';
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
} from '../__testData__';
describe('SqlQuery/ExecuteResult', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
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
    const mockSetQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    const { container } = render(
      <ExecuteResult
        resultErrorMessage=""
        queryRes={queryResShow}
        setQueryRes={mockSetQueryRes}
        setResultErrorMessage={setResultErrorMessage}
        maxPreQueryRows={50}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when queryRes length is empty', () => {
    const mockSetQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();

    const { container, rerender } = render(
      <ExecuteResult
        resultErrorMessage=""
        queryRes={queryResHide_1}
        setQueryRes={mockSetQueryRes}
        setResultErrorMessage={setResultErrorMessage}
        maxPreQueryRows={50}
      />
    );

    expect(container).toMatchSnapshot();
    rerender(
      <ExecuteResult
        resultErrorMessage=""
        queryRes={queryResHide_2}
        setQueryRes={mockSetQueryRes}
        setResultErrorMessage={setResultErrorMessage}
        maxPreQueryRows={50}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should match snaoshot when resultErrorMessage is not empty', () => {
    const mockSetQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    const { container } = render(
      <ExecuteResult
        resultErrorMessage="error"
        queryRes={queryResShow}
        setQueryRes={mockSetQueryRes}
        setResultErrorMessage={setResultErrorMessage}
        maxPreQueryRows={50}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should be requested when switching the paginator', async () => {
    const mockSetQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    const getSqlResult = mockGetSqlResult();
    const { container } = render(
      <ExecuteResult
        resultErrorMessage=""
        queryRes={queryResShow}
        setQueryRes={mockSetQueryRes}
        setResultErrorMessage={setResultErrorMessage}
        maxPreQueryRows={5}
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
    expect(setResultErrorMessage).toBeCalledTimes(0);
    expect(mockSetQueryRes).toBeCalledTimes(1);

    jest.clearAllMocks();
    jest.clearAllTimers();

    const getSqlResultHasError = mockGetSqlResultHasError();
    fireEvent.click(container.querySelector('.ant-pagination-next')!);
    expect(getSqlResultHasError).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(setResultErrorMessage).toBeCalledTimes(1);
    expect(mockSetQueryRes).toBeCalledTimes(0);
  });

  test('should execute setQueryRes when removing tabs', () => {
    const mockSetQueryRes = jest.fn();
    const setResultErrorMessage = jest.fn();
    const { container } = render(
      <ExecuteResult
        resultErrorMessage=""
        queryRes={queryResShow}
        setQueryRes={mockSetQueryRes}
        setResultErrorMessage={setResultErrorMessage}
        maxPreQueryRows={5}
      />
    );

    expect(mockSetQueryRes).toBeCalledTimes(0);
    expect(
      container.querySelectorAll('.ant-tabs-tab-remove')[0]
    ).toBeInTheDocument();
    fireEvent.click(container.querySelectorAll('.ant-tabs-tab-remove')[0]);
    expect(mockSetQueryRes).toBeCalledTimes(1);
    const queryResAfter = [...queryResShow];
    queryResAfter[0].hide = true;
    expect(mockSetQueryRes).toBeCalledWith(queryResAfter);
  });
});
