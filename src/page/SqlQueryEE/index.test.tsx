import { waitFor } from '@testing-library/react';
import SqlQueryEE from '.';
import configuration from '../../api/configuration';
import { renderWithTheme } from '../../testUtils/customRender';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';

describe('SqlQueryEE', () => {
  const mockGetQueryUrl = () => {
    const spy = jest.spyOn(configuration, 'getSQLQueryConfiguration');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        enable_sql_query: false,
        sql_query_root_uri: '/sql_query',
      })
    );
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const req = mockGetQueryUrl();
    const { container } = renderWithTheme(<SqlQueryEE />);
    expect(container).toMatchSnapshot();
    expect(req).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render error when req throw error', async () => {
    const req = mockGetQueryUrl();
    req.mockImplementation(() => resolveErrorThreeSecond({}));
    const { container } = renderWithTheme(<SqlQueryEE />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  it('should jump to sql query url when request return correct address', async () => {
    const req = mockGetQueryUrl();
    req.mockImplementation(() =>
      resolveThreeSecond({
        enable_sql_query: true,
        sql_query_root_uri: '/new_sql_query',
      })
    );
    const openSpy = jest.spyOn(window, 'open');
    openSpy.mockImplementation(() => void 0 as any);
    renderWithTheme(<SqlQueryEE />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(openSpy).toBeCalledTimes(1);
    expect(openSpy).toBeCalledWith('/new_sql_query');
  });
});
