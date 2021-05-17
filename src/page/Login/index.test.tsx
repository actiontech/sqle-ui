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

jest.mock('./LoginBackground', () => {
  class Test {}
  return Test;
});

describe('Login', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    const temp = mockUseDispatch();
    dispatchMock = temp.scopeDispatch;
    mockUseSelector({ locale: { language: SupportLanguage.zhCN } });
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

  test('should render login form', () => {
    const { container } = renderWithTheme(<Login />);
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
    expect(history.location.pathname).toBe('/');
  });
});
