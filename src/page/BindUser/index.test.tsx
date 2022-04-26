import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import BindUser from '.';
import oauth2 from '../../api/oauth2';
import { SupportLanguage } from '../../locale';
import {
  renderWithTheme,
  renderWithThemeAndServerRouter,
} from '../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../testUtils/mockRequest';
import { createMemoryHistory } from 'history';
import { getBySelector } from '../../testUtils/customQuery';

jest.mock('../Login/LoginBackground', () => {
  class Test {}
  return Test;
});

describe('bindUser', () => {
  let useDispatch!: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    useDispatch = mockUseDispatch().scopeDispatch;
    mockUseSelector({ locale: { language: SupportLanguage.zhCN } });
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

  it('should show error when url params includes error', () => {
    mockLocationSearch('error=this is error');
    renderWithTheme(<BindUser />);
    expect(screen.queryByText('this is error')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-notification-close-x'));
    expect(screen.queryByText('this is error')).not.toBeInTheDocument();
  });

  it('should show lostToken error when url params include user_exit but not include sqle_token', async () => {
    mockLocationSearch('user_exist=true');
    renderWithTheme(<BindUser />);
    await waitFor(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByText('login.oauth.lostToken')).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-notification-close-x'));
    expect(screen.queryByText('login.oauth.lostToken')).not.toBeInTheDocument();
  });

  it('should update token and jump to `/` when url params include user exist and token', async () => {
    mockLocationSearch('user_exist=true&sqle_token=token');
    const history = createMemoryHistory();
    history.push('/bindUser');
    expect(history.location.pathname).toBe('/bindUser');
    renderWithThemeAndServerRouter(<BindUser />, undefined, { history });
    expect(useDispatch).toBeCalledTimes(1);
    expect(useDispatch).toBeCalledWith({
      payload: {
        token: 'token',
      },
      type: 'user/updateToken',
    });
    expect(history.location.pathname).toBe('/');
  });

  it('should bind user when url params include user exist=false and oauth2_user_id', async () => {
    mockLocationSearch('user_exist=false&oauth2_user_id=user_id');
    const bindUser = mockBindUser();
    const history = createMemoryHistory();
    history.push('/bindUser');
    expect(history.location.pathname).toBe('/bindUser');
    renderWithThemeAndServerRouter(<BindUser />, undefined, { history });

    fireEvent.input(screen.getByPlaceholderText('login.oauth.form.username'), {
      target: { value: 'username' },
    });
    fireEvent.input(screen.getByPlaceholderText('common.password'), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByText('login.oauth.submitButton'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(bindUser).toBeCalledTimes(1);
    expect(bindUser).toBeCalledWith({
      oauth2_user_id: 'user_id',
      user_name: 'username',
      pwd: 'password',
    });

    fireEvent.click(screen.getByText('login.oauth.submitButton'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(bindUser).toBeCalledTimes(1);

    expect(history.location.pathname).toBe('/bindUser');

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(history.location.pathname).toBe('/');
    expect(useDispatch).toBeCalledTimes(1);
    expect(useDispatch).toBeCalledWith({
      payload: {
        token: 'token',
      },
      type: 'user/updateToken',
    });
  });

  it('should show lost lostOauthUserId error when url params include user_exist=false but not include oauth2_user_id', async () => {
    mockLocationSearch('user_exist=false');
    const bindUser = mockBindUser();
    const history = createMemoryHistory();
    history.push('/bindUser');
    expect(history.location.pathname).toBe('/bindUser');
    renderWithThemeAndServerRouter(<BindUser />, undefined, { history });

    fireEvent.input(screen.getByPlaceholderText('login.oauth.form.username'), {
      target: { value: 'username' },
    });
    fireEvent.input(screen.getByPlaceholderText('common.password'), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByText('login.oauth.submitButton'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(bindUser).toBeCalledTimes(0);
    expect(
      screen.queryByText('login.oauth.lostOauthUserId')
    ).toBeInTheDocument();

    fireEvent.click(getBySelector('.ant-notification-close-x'));

    expect(
      screen.queryByText('login.oauth.lostOauthUserId')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('login.oauth.submitButton'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(bindUser).toBeCalledTimes(0);
    expect(
      screen.queryByText('login.oauth.lostOauthUserId')
    ).toBeInTheDocument();
    fireEvent.click(getBySelector('.ant-notification-close-x'));

    expect(
      screen.queryByText('login.oauth.lostOauthUserId')
    ).not.toBeInTheDocument();
  });
});
