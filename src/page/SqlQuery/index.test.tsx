import { act, fireEvent, screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import SqlQueryEE from '.';
import configuration from '../../api/configuration';
import { OPEN_CLOUD_BEAVER_URL_PARAM_NAME } from '../../data/common';
import { renderWithThemeAndRouter } from '../../testUtils/customRender';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('SqlQueryEE', () => {
  const useLocationMock: jest.Mock = useLocation as jest.Mock;

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
    useLocationMock.mockReturnValue({
      pathname: '/sqlQuery',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const req = mockGetQueryUrl();
    const { container } = renderWithThemeAndRouter(<SqlQueryEE />);
    expect(container).toMatchSnapshot();
    expect(req).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('should render error when req throw error', async () => {
    const req = mockGetQueryUrl();
    req.mockImplementation(() => resolveErrorThreeSecond({}));
    const { container } = renderWithThemeAndRouter(<SqlQueryEE />);
    await act(async () => jest.advanceTimersByTime(3000));

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
    const { container } = renderWithThemeAndRouter(<SqlQueryEE />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(openSpy).toBeCalledTimes(0);
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('sqlQuery.jumpToCloudbeaver'));
    expect(openSpy).toBeCalledTimes(1);
    expect(openSpy).toBeCalledWith('/new_sql_query');
  });

  it('should auto open cloud beaver when url "open_cloud_beaver" params is exists', async () => {
    useLocationMock.mockReturnValue({
      pathname: '`sqlQuery',
      search: `?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`,
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
    mockGetQueryUrl().mockImplementation(() =>
      resolveThreeSecond({
        enable_sql_query: true,
        sql_query_root_uri: '/new_sql_query',
      })
    );
    const openSpy = jest.spyOn(window, 'open');
    openSpy.mockImplementation(() => void 0 as any);
    renderWithThemeAndRouter(<SqlQueryEE />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(openSpy).toBeCalledTimes(1);
    expect(openSpy).toBeCalledWith('/new_sql_query');
  });
});
