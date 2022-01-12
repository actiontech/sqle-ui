import Header from '.';
import {
  renderWithMemoryRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { createMemoryHistory } from 'history';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { SupportLanguage } from '../../../locale';
import { SupportTheme } from '../../../theme';
import { ModalName } from '../../../data/ModalName';

describe('Header', () => {
  let scopeDispatch: jest.Mock;
  beforeEach(() => {
    mockUseSelector({
      user: { username: 'admin', theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
    });
    scopeDispatch = mockUseDispatch().scopeDispatch;
  });

  afterEach(() => {
    scopeDispatch.mockClear();
    jest.clearAllMocks();
  });

  test('should render username by redux state', () => {
    const { container, rerender } = render(<Header />);
    expect(container).toMatchSnapshot();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByTestId('system-icon')).toBeInTheDocument();
    mockUseSelector({
      user: { username: 'test' },
      locale: { language: SupportLanguage.zhCN },
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
    });
    rerender(<Header />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('should render system menu when user click the username', async () => {
    const { baseElement } = renderWithMemoryRouter(<Header />);
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

  test('should render version info menu when user hover the icon', async () => {
    const { baseElement } = renderWithMemoryRouter(<Header />);
    fireEvent.mouseEnter(screen.getByTestId('system-icon'));

    await waitFor(() => screen.getByText('system.log.version'));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('system.log.version'));
    expect(scopeDispatch).toBeCalledTimes(2);
    expect(scopeDispatch.mock.calls[1][0]).toEqual({
      payload: { modalName: ModalName.SHOW_VERSION, status: true },
      type: 'nav/updateModalStatus',
    });
  });

  test('should render theme change button by current theme', async () => {
    mockUseSelector({
      user: { username: 'admin', theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
    });
    renderWithMemoryRouter(<Header />);
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
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
    });
    renderWithMemoryRouter(<Header />);
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
    renderWithServerRouter(<Header />, undefined, { history });
    expect(scopeDispatch).toBeCalledTimes(1);
    fireEvent.mouseEnter(screen.getByText('admin'));
    await waitFor(() => screen.getByText(/common.logout/i));
    expect(history.location.pathname).toBe('/test');
    fireEvent.click(screen.getByText('common.logout'));
    expect(scopeDispatch).toBeCalledTimes(3);
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
});
