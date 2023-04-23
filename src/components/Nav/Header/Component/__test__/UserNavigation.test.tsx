import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SupportLanguage } from '../../../../../locale';
import {
  renderWithMemoryRouter,
  renderWithRouter,
} from '../../../../../testUtils/customRender';
import { SupportTheme } from '../../../../../theme';
import UserNavigation from '../UserNavigation';

import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import user from '../../../../../api/user';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useNavigate from '../../../../../hooks/useNavigate';
import { act } from 'react-dom/test-utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../../../../hooks/useNavigate', () => {
  return jest.fn();
});

describe('test Nav/Header/UserNavigation', () => {
  const scopeDispatch = jest.fn();
  const navigateSpy = jest.fn();
  let logoutSpy: jest.SpyInstance;
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  beforeEach(() => {
    logoutSpy = mockLogout();
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { username: 'admin', theme: SupportTheme.LIGHT },
        locale: { language: SupportLanguage.zhCN },
      });
    });
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    useLocationMock.mockReturnValue({
      pathname: '/rule',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
  });

  afterEach(() => {
    scopeDispatch.mockClear();
    jest.clearAllMocks();
    jest.useRealTimers();
    useLocationMock.mockRestore();
  });

  const mockLogout = () => {
    const spy = jest.spyOn(user, 'logoutV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should render username by redux state', () => {
    const { container, rerender } = render(<UserNavigation />);
    expect(container).toMatchSnapshot();
    expect(screen.getByText('admin')).toBeInTheDocument();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { username: 'test' },
        locale: { language: SupportLanguage.zhCN },
      });
    });
    rerender(<UserNavigation />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('should render system menu when user click the username', async () => {
    const { baseElement } = renderWithMemoryRouter(<UserNavigation />);
    fireEvent.mouseEnter(screen.getByText('admin'));

    await screen.findByText('common.logout');

    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('common.theme.light')).not.toBeInTheDocument();
    expect(screen.getByText('common.theme.dark')).toBeInTheDocument();
  });

  test('should render theme change button by current theme', async () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { username: 'admin', theme: SupportTheme.LIGHT },
        locale: { language: SupportLanguage.zhCN },
      });
    });
    renderWithMemoryRouter(<UserNavigation />);
    fireEvent.mouseEnter(screen.getByText('admin'));
    await screen.findByText('common.logout');

    expect(screen.queryByText('common.theme.light')).not.toBeInTheDocument();

    expect(screen.getByText('common.theme.dark')).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.theme.dark'));
    expect(screen.getByText('common.theme.dark').parentNode).toHaveClass(
      'ant-dropdown-menu-item-disabled'
    );
    expect(scopeDispatch).toBeCalledTimes(1);
    expect(scopeDispatch).nthCalledWith(1, {
      payload: {
        theme: 'dark',
      },
      type: 'user/updateTheme',
    });

    cleanup();
    scopeDispatch.mockClear();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { username: 'admin', theme: SupportTheme.DARK },
        locale: { language: SupportLanguage.zhCN },
      });
    });
    renderWithMemoryRouter(<UserNavigation />);
    fireEvent.mouseEnter(screen.getByText('admin'));
    await screen.findByText('common.logout');

    expect(screen.getByText('common.theme.light')).toBeInTheDocument();

    expect(screen.queryByText('common.theme.dark')).not.toBeInTheDocument();
  });

  test('should clean user info and jump to "/login" router when click the logout button', async () => {
    renderWithRouter(<UserNavigation />);
    expect(scopeDispatch).toBeCalledTimes(0);
    fireEvent.mouseEnter(screen.getByText('admin'));
    await screen.findByText('common.logout');
    expect(logoutSpy).toBeCalledTimes(0);
    fireEvent.click(screen.getByText('common.logout'));
    expect(logoutSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(scopeDispatch).toBeCalledTimes(4);
    expect(scopeDispatch).nthCalledWith(1, {
      payload: { bindProjects: [] },
      type: 'user/updateBindProjects',
    });
    expect(scopeDispatch).nthCalledWith(2, {
      payload: { username: '', role: '' },
      type: 'user/updateUser',
    });
    expect(scopeDispatch).nthCalledWith(3, {
      payload: { token: '' },
      type: 'user/updateToken',
    });
    expect(scopeDispatch).nthCalledWith(4, {
      payload: { managementPermissions: [] },
      type: 'user/updateManagementPermissions',
    });
    expect(navigateSpy).toBeCalledWith('/login', { replace: true });
    expect(navigateSpy).toBeCalledTimes(1);
  });

  test('should jump to "/account" when clicking "common.account"', async () => {
    renderWithRouter(<UserNavigation />);

    fireEvent.mouseEnter(screen.getByText('admin'));
    await screen.findByText('common.account');

    expect(screen.getByText('common.account')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.account'));
    expect(navigateSpy).toBeCalledWith('account');
    expect(navigateSpy).toBeCalledTimes(1);
  });
});
