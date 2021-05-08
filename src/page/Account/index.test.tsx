import { act, render, waitFor, screen } from '@testing-library/react';
import Account from '.';
import user from '../../api/user';
import { resolveThreeSecond } from '../../testUtils/mockRequest';

describe('Account', () => {
  const mockRequest = () => {
    const spy = jest.spyOn(user, 'getCurrentUserV1');
    return spy;
  };

  beforeEach(() => {
    const userSpy = mockRequest();
    userSpy.mockImplementation(() =>
      resolveThreeSecond({
        email: 'aaaa@bbbb.ccc',
        is_admin: false,
        role_name_list: ['role1', 'role2'],
        user_name: 'user_test1',
      })
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should render user Info when request is success', async () => {
    const { container } = render(<Account />);
    expect(container).toMatchSnapshot();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => screen.findByText('user_test1'));
    expect(container).toMatchSnapshot();
  });
});
