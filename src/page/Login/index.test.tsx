import Login from '.';
import { SupportLanguage } from '../../locale';
import {
  renderWithTheme,
  renderWithThemeAndServerRouter,
} from '../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../testUtils/mockRedux';
import { createMemoryHistory } from 'history';
import { fireEvent, screen, act, waitFor } from '@testing-library/react';
import user from '../../api/user';
import { resolveThreeSecond } from '../../testUtils/mockRequest';
import configuration from '../../api/configuration';
import { useLocation } from 'react-router-dom';
import {
  OPEN_CLOUD_BEAVER_URL_PARAM_NAME,
  SQLE_DEFAULT_WEB_TITLE,
} from '../../data/common';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('Login', () => {
  let dispatchMock: jest.Mock;
  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    const temp = mockUseDispatch();
    dispatchMock = temp.scopeDispatch;
    mockUseSelector({
      locale: { language: SupportLanguage.zhCN },
      system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: '' },
    });
    mockGetOauth2Tips();
    jest.useFakeTimers();
    useLocationMock.mockReturnValue({
      pathname: '/login',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
  });

  beforeAll(() => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value:
        'sqle-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzY1MzkyNjMsIm5hbWUiOiJhZG1pbiJ9.g1_g7JHE4PjMoBvR0Jq4h_sgA-4QVY_S92rl3BxCENQ',
    });
  });

  afterAll(() => {
    Object.defineProperty(document, 'cookie', {
      writable: false,
      value: '',
    });
  });

  afterEach(() => {
    dispatchMock.mockClear();
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(user, 'loginV2');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockGetOauth2Tips = () => {
    const spy = jest.spyOn(configuration, 'getOauth2Tips');
    spy.mockImplementation(() =>
      resolveThreeSecond({ enable_oauth2: true, login_tip: 'login with QQ' })
    );
    return spy;
  };

  test('should render login form', async () => {
    const { container } = renderWithTheme(<Login />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should sent login request when click the login button', async () => {
    const history = createMemoryHistory();
    const request = mockRequest();
    history.push('/login');
    renderWithThemeAndServerRouter(<Login />, undefined, {
      history,
    });
    fireEvent.input(screen.getByPlaceholderText('common.username'), {
      target: { value: 'root' },
    });
    fireEvent.input(screen.getByPlaceholderText('common.password'), {
      target: { value: '123456' },
    });
    act(() => {
      fireEvent.click(screen.getByText('login.login'));
    });

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    expect(history.location.pathname).toBe('/login');
    expect(request).not.toBeCalled();
    expect(
      screen.queryByText('login.errorMessage.userAgreement')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('login.userAgreementTips'));
    act(() => {
      fireEvent.click(screen.getByText('login.login'));
    });

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith({
      username: 'root',
      password: '123456',
    });
    expect(dispatchMock).not.toBeCalled();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(dispatchMock).toBeCalledWith({
      payload: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzY1MzkyNjMsIm5hbWUiOiJhZG1pbiJ9.g1_g7JHE4PjMoBvR0Jq4h_sgA-4QVY_S92rl3BxCENQ',
      },
      type: 'user/updateToken',
    });
    expect(history.location.pathname).toBe('/');
  });

  test('click oauth login button will jump to `/v1/oauth2/link`', async () => {
    renderWithTheme(<Login />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('login with QQ').closest('a')).toHaveAttribute(
      'href',
      '/v1/oauth2/link'
    );
  });

  test('should jump path when url target params is exists', async () => {
    useLocationMock.mockReturnValue({
      pathname: '/login',
      search: '?target=/rule',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });

    const history = createMemoryHistory();
    const request = mockRequest();
    history.push('/login');
    renderWithThemeAndServerRouter(<Login />, undefined, {
      history,
    });
    fireEvent.input(screen.getByPlaceholderText('common.username'), {
      target: { value: 'root' },
    });
    fireEvent.input(screen.getByPlaceholderText('common.password'), {
      target: { value: '123456' },
    });
    act(() => {
      fireEvent.click(screen.getByText('login.login'));
    });

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    expect(history.location.pathname).toBe('/login');
    expect(request).not.toBeCalled();
    expect(
      screen.queryByText('login.errorMessage.userAgreement')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('login.userAgreementTips'));
    act(() => {
      fireEvent.click(screen.getByText('login.login'));
    });

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(history.location.pathname).toBe('/rule');
  });

  test('should set url params when url search is "/sqlQuery"', async () => {
    useLocationMock.mockReturnValue({
      pathname: '/login',
      search: '?target=/sqlQuery',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });

    const history = createMemoryHistory();
    const request = mockRequest();
    history.push('/login');
    renderWithThemeAndServerRouter(<Login />, undefined, {
      history,
    });
    fireEvent.input(screen.getByPlaceholderText('common.username'), {
      target: { value: 'root' },
    });
    fireEvent.input(screen.getByPlaceholderText('common.password'), {
      target: { value: '123456' },
    });
    act(() => {
      fireEvent.click(screen.getByText('login.login'));
    });

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    expect(history.location.pathname).toBe('/login');
    expect(request).not.toBeCalled();
    expect(
      screen.queryByText('login.errorMessage.userAgreement')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('login.userAgreementTips'));
    act(() => {
      fireEvent.click(screen.getByText('login.login'));
    });

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(history.location.pathname).toBe('/sqlQuery');
    expect(history.location.search).toBe(
      `?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`
    );
  });
});
