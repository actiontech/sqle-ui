import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import useUserInfo from '.';
import user from '../../api/user';
import { mockUseDispatch } from '../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';
import {
  mockBindProjects,
  mockManagementPermissions,
} from '../useCurrentUser/index.test';

export const mockGetCurrentUser = () => {
  const spy = jest.spyOn(user, 'getCurrentUserV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      user_name: 'test',
      is_admin: '',
      bind_projects: mockBindProjects,
      management_permission_list: mockManagementPermissions,
    })
  );
  return spy;
};

describe('test useUserInfo', () => {
  let getUserSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    dispatchSpy = mockUseDispatch().scopeDispatch;
    getUserSpy = mockGetCurrentUser();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  test('should send request when execute "clearUserInfo"', async () => {
    const { result } = renderHook(() => useUserInfo());
    act(() => {
      result.current.clearUserInfo();
    });

    expect(dispatchSpy).toBeCalledTimes(4);
    expect(dispatchSpy).nthCalledWith(1, {
      payload: { bindProjects: [] },
      type: 'user/updateBindProjects',
    });
    expect(dispatchSpy).nthCalledWith(2, {
      payload: { username: '', role: '' },
      type: 'user/updateUser',
    });
    expect(dispatchSpy).nthCalledWith(3, {
      payload: { token: '' },
      type: 'user/updateToken',
    });
    expect(dispatchSpy).nthCalledWith(4, {
      payload: { managementPermissions: [] },
      type: 'user/updateManagementPermissions',
    });
  });

  test('should send request when execute "getUserInfo"', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook(() =>
      useUserInfo()
    );
    expect(getUserSpy).toBeCalledTimes(0);
    act(() => {
      result.current.getUserInfo();
    });
    expect(getUserSpy).toBeCalledTimes(1);
    expect(result.current.getUserInfoLoading).toBeTruthy();

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.getUserInfoLoading).toBeFalsy();
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).nthCalledWith(1, {
      payload: { bindProjects: mockBindProjects },
      type: 'user/updateBindProjects',
    });
    expect(dispatchSpy).nthCalledWith(2, {
      payload: { username: 'test', role: '' },
      type: 'user/updateUser',
    });

    expect(dispatchSpy).nthCalledWith(3, {
      payload: { managementPermissions: mockManagementPermissions },
      type: 'user/updateManagementPermissions',
    });

    getUserSpy.mockClear();
    dispatchSpy.mockClear();

    getUserSpy.mockImplementation(() => resolveErrorThreeSecond({}));
    rerender();
    act(() => {
      result.current.getUserInfo();
    });
    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(dispatchSpy).toBeCalledTimes(4);
    expect(dispatchSpy).nthCalledWith(1, {
      payload: { bindProjects: [] },
      type: 'user/updateBindProjects',
    });
    expect(dispatchSpy).nthCalledWith(2, {
      payload: { username: '', role: '' },
      type: 'user/updateUser',
    });
    expect(dispatchSpy).nthCalledWith(3, {
      payload: { token: '' },
      type: 'user/updateToken',
    });
    expect(dispatchSpy).nthCalledWith(4, {
      payload: { managementPermissions: [] },
      type: 'user/updateManagementPermissions',
    });
  });
});
