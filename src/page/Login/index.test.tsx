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

describe('Login', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    const temp = mockUseDispatch();
    dispatchMock = temp.scopeDispatch;
    mockUseSelector({ locale: { language: SupportLanguage.zhCN } });
    mockGetOauth2Tips();
    jest.useFakeTimers();
  });

  afterEach(() => {
    dispatchMock.mockClear();
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(user, 'loginV1');
    spy.mockImplementation(() => resolveThreeSecond({ token: 'testToken' }));
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
        token: 'testToken',
      },
      type: 'user/updateToken',
    });
    expect(history.location.pathname).toBe('/dashboard');
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
});
