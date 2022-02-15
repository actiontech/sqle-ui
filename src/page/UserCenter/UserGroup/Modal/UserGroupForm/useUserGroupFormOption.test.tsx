import { renderHook } from '@testing-library/react-hooks';
import {
  mockUseRole,
  mockUseUsername,
} from '../../../../../testUtils/mockRequest';
import useUserGroupFormOption from './useUserGroupFormOption';

describe('useUserGroupFormOption', () => {
  let roleSpy: jest.SpyInstance;
  let usernameSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    roleSpy = mockUseRole();
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
    expect(result.current.roleList).toEqual([]);
    expect(result.current.usernameList).toEqual([]);
    expect(roleSpy).toBeCalledTimes(1);
    expect(usernameSpy).toBeCalledTimes(1);
    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(result.current.roleList).toEqual([{ role_name: 'role_name1' }]);
    expect(result.current.usernameList).toEqual([{ user_name: 'user_name1' }]);
  });

  it('should not send any request when visible is falsy', async () => {
    const { result } = renderHook(() => useUserGroupFormOption(false));
    expect(result.current.roleList).toEqual([]);
    expect(result.current.usernameList).toEqual([]);
    expect(roleSpy).not.toBeCalled();
    expect(usernameSpy).not.toBeCalled();
  });
});
