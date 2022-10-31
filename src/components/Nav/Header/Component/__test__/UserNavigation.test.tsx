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

describe('test Nav/Header/UserNavigation', () => {
  let scopeDispatch: jest.Mock;
  beforeEach(() => {
    mockUseSelector({
      user: { username: 'admin', theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
    });
    scopeDispatch = mockUseDispatch().scopeDispatch;
  });

  afterEach(() => {
    scopeDispatch.mockClear();
    jest.clearAllMocks();
  });

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
    await waitFor(() => screen.getByText(/common.logout/i));
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
    await waitFor(() => screen.getByText(/common.logout/i));
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
    await waitFor(() => screen.getByText(/common.logout/i));
    expect(history.location.pathname).toBe('/test');
    fireEvent.click(screen.getByText('common.logout'));
    expect(scopeDispatch).toBeCalledTimes(2);
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        role: '',
        username: '',
      },
      type: 'user/updateUser',
    });
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        token: '',
      },
      type: 'user/updateToken',
    });
    expect(history.location.pathname).toBe('/');
  });

  test('should jump to "/account" when clicking "common.account"', async () => {
    const history = createMemoryHistory();
    history.push('/test');
    renderWithServerRouter(<UserNavigation />, undefined, { history });
    expect(history.location.pathname).toBe('/test');

    fireEvent.mouseEnter(screen.getByText('admin'));
    await waitFor(() => screen.getByText(/common.account/i));

    expect(screen.queryByText('common.account')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.account'));
    expect(history.location.pathname).toBe('/account');
  });
});
