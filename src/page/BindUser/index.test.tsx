import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import BindUser from '.';
import oauth2 from '../../api/oauth2';
import { SupportLanguage } from '../../locale';
import { renderWithTheme } from '../../testUtils/customRender';
import { resolveThreeSecond } from '../../testUtils/mockRequest';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from '../../hooks/useNavigate';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../hooks/useNavigate', () => jest.fn());

describe('bindUser', () => {
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        locale: { language: SupportLanguage.zhCN },
      })
    );
  });

  afterEach(() => {
    mockLocationSearch('');
    cleanup();
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const mockBindUser = () => {
    const spy = jest.spyOn(oauth2, 'bindOauth2User');
    spy.mockImplementation(() => resolveThreeSecond({ token: 'token' }));
    return spy;
  };

  const mockLocationSearch = (search: string) => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        search: `?${search}`,
      },
    });
  };

  it('should match snapshot', () => {
    const { container } = renderWithTheme(<BindUser />);
    expect(container).toMatchSnapshot();
  });

  it('should show error when url params includes error', async () => {
    mockLocationSearch('error=this is error');
    renderWithTheme(<BindUser />);
    expect(screen.getByText('this is error')).toBeInTheDocument();
  });

  it('should show lostToken error when url params include user_exit but not include sqle_token', async () => {
    mockLocationSearch('user_exist=true');
    renderWithTheme(<BindUser />);
    await screen.findByText('login.oauth.lostToken');
    expect(screen.getByText('login.oauth.lostToken')).toBeInTheDocument();
  });

  it('should update token and jump to `/` when url params include user exist and token', async () => {
    mockLocationSearch('user_exist=true&sqle_token=token');
    renderWithTheme(<BindUser />);
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        token: 'token',
      },
      type: 'user/updateToken',
    });
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(1, '/');
  });

  it('should bind user when url params include user exist=false and oauth2_user_id', async () => {
    mockLocationSearch('user_exist=false&oauth2_token=oauth2_token');
    const bindUser = mockBindUser();
    renderWithTheme(<BindUser />);

    fireEvent.input(screen.getByPlaceholderText('login.oauth.form.username'), {
      target: { value: 'username' },
    });
    fireEvent.input(screen.getByPlaceholderText('common.password'), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByText('login.oauth.submitButton'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(bindUser).toBeCalledTimes(1);
    expect(bindUser).toBeCalledWith({
      oauth2_token: 'oauth2_token',
      user_name: 'username',
      pwd: 'password',
    });

    fireEvent.click(screen.getByText('login.oauth.submitButton'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(bindUser).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith('/');
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        token: 'token',
      },
      type: 'user/updateToken',
    });
  });

  it('should show lost lostOauthUserId error when url params include user_exist=false but not include oauth2Token', async () => {
    mockLocationSearch('user_exist=false');
    const bindUser = mockBindUser();
    renderWithTheme(<BindUser />);

    fireEvent.input(screen.getByPlaceholderText('login.oauth.form.username'), {
      target: { value: 'username' },
    });
    fireEvent.input(screen.getByPlaceholderText('common.password'), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByText('login.oauth.submitButton'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(bindUser).toBeCalledTimes(0);
    await screen.findByText('login.oauth.lostOauth2Token');

    expect(screen.getByText('login.oauth.lostOauth2Token')).toBeInTheDocument();

    fireEvent.click(screen.getByText('login.oauth.submitButton'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(bindUser).toBeCalledTimes(0);
  });
});
