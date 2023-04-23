import { act, screen, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import Account from '.';
import user from '../../api/user';
import { resolveThreeSecond } from '../../testUtils/mockRequest';
import { renderWithRedux } from '../../testUtils/customRender';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('../../hooks/useNavigate', () => jest.fn());

describe('Account', () => {
  const mockRequest = () => {
    const spy = jest.spyOn(user, 'getCurrentUserV1');
    return spy;
  };
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  beforeEach(() => {
    const userSpy = mockRequest();
    userSpy.mockImplementation(() =>
      resolveThreeSecond({
        email: 'aaaa@bbbb.ccc',
        is_admin: false,
        user_name: 'user_test1',
        login_type: 'sqle',
      })
    );
    jest.useFakeTimers();
    useLocationMock.mockReturnValue({
      pathname: '/rule',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    useLocationMock.mockRestore();
  });

  test('should render user Info when request is success', async () => {
    const { container } = renderWithRedux(<Account />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('user_test1');
    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('accountModifyPasswordBtn')).not.toBeDisabled();
  });

  test('should open modify password modal when user click modify password button', () => {
    renderWithRedux(<Account />);
    fireEvent.click(screen.getByText('account.modifyPassword.button'));
    expect(
      screen.getByText('account.modifyPassword.title')
    ).toBeInTheDocument();
  });

  test('should be disabled modify password button when user type is ldap', async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    const userSpy = mockRequest();
    userSpy.mockImplementation(() =>
      resolveThreeSecond({
        email: 'aaaa@bbbb.ccc',
        is_admin: false,
        role_name_list: ['role1', 'role2'],
        user_name: 'user_test1',
        login_type: 'ldap',
      })
    );
    renderWithRedux(<Account />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByTestId('accountModifyPasswordBtn')).toBeDisabled();
  });
});
