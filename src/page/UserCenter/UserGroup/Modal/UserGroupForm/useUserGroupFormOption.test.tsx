import { renderHook } from '@testing-library/react-hooks';
import { mockUseUsername } from '../../../../../testUtils/mockRequest';
import useUserGroupFormOption from './useUserGroupFormOption';

describe('useUserGroupFormOption', () => {
  let usernameSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    usernameSpy = mockUseUsername();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should get role and usernames when visible is truthy', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUserGroupFormOption(true)
    );
    expect(result.current.usernameList).toEqual([]);
    expect(usernameSpy).toBeCalledTimes(1);
    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(result.current.usernameList).toEqual([{ user_name: 'user_name1' }]);
  });

  it('should not send any request when visible is falsy', async () => {
    const { result } = renderHook(() => useUserGroupFormOption(false));
    expect(result.current.usernameList).toEqual([]);
    expect(usernameSpy).not.toBeCalled();
  });
});
