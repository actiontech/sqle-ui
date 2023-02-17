import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { SupportLanguage } from '../../../../../locale';
import {
  renderWithMemoryRouter,
  renderWithServerRouter,
} from '../../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import { SupportTheme } from '../../../../../theme';
import UserNavigation from '../UserNavigation';
import { createMemoryHistory } from 'history';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import user from '../../../../../api/user';

describe('test Nav/Header/UserNavigation', () => {
  let scopeDispatch: jest.Mock;
  let logoutSpy: jest.SpyInstance;
  beforeEach(() => {
    logoutSpy = mockLogout();
    mockUseSelector({
      user: { username: 'admin', theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
    });
    jest.useFakeTimers();
    scopeDispatch = mockUseDispatch().scopeDispatch;
  });

  afterEach(() => {
    scopeDispatch.mockClear();
    jest.clearAllMocks();
    jest.useRealTimers();
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
    mockUseSelector({
      user: { username: 'test' },
      locale: { language: SupportLanguage.zhCN },
    });
    rerender(<UserNavigation />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('should render system menu when user click the username', async () => {
    const { baseElement } = renderWithMemoryRouter(<UserNavigation />);
    fireEvent.mouseEnter(screen.getByText('admin'));

    await waitFor(() => screen.getByText('common.logout'));

    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('common.theme.light').parentNode).toHaveAttribute(
      'hidden'
    );
    expect(
      screen.getByText('common.theme.dark').parentNode
    ).not.toHaveAttribute('hidden');
  });

  test('should render theme change button by current theme', async () => {
    mockUseSelector({
      user: { username: 'admin', theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
    });
    renderWithMemoryRouter(<UserNavigation />);
    fireEvent.mouseEnter(screen.getByText('admin'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.theme.light').parentNode).toHaveAttribute(
      'hidden'
    );
    expect(
      screen.getByText('common.theme.dark').parentNode
    ).not.toHaveAttribute('hidden');
    cleanup();
    mockUseSelector({
      user: { username: 'admin', theme: SupportTheme.DARK },
      locale: { language: SupportLanguage.zhCN },
    });
    renderWithMemoryRouter(<UserNavigation />);
    fireEvent.mouseEnter(screen.getByText('admin'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('common.theme.light').parentNode
    ).not.toHaveAttribute('hidden');
    expect(screen.getByText('common.theme.dark').parentNode).toHaveAttribute(
      'hidden'
    );
  });

  test('should clean user info and jump to "/" router when click the logout button', async () => {
    const history = createMemoryHistory();
    history.push('/test');
    renderWithServerRouter(<UserNavigation />, undefined, { history });
    expect(scopeDispatch).toBeCalledTimes(0);
    fireEvent.mouseEnter(screen.getByText('admin'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(history.location.pathname).toBe('/test');
    expect(logoutSpy).toBeCalledTimes(0);
    fireEvent.click(screen.getByText('common.logout'));
    expect(logoutSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
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
    expect(history.location.pathname).toBe('/');
  });

  test('should jump to "/account" when clicking "common.account"', async () => {
    const history = createMemoryHistory();
    history.push('/test');
    renderWithServerRouter(<UserNavigation />, undefined, { history });
    expect(history.location.pathname).toBe('/test');

    fireEvent.mouseEnter(screen.getByText('admin'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.account')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.account'));
    expect(history.location.pathname).toBe('/account');
  });
});
