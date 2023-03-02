import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useHistory, useLocation } from 'react-router-dom';
import useUserInfo from '.';
import user from '../../api/user';
import { SQLE_REDIRECT_KEY_PARAMS_NAME } from '../../data/common';
import { mockUseDispatch } from '../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';
import {
  mockBindProjects,
  mockManagementPermissions,
} from '../useCurrentUser/index.test';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useHistory: jest.fn(),
}));

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
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  const useHistoryMock: jest.Mock = useHistory as jest.Mock;
  const replaceMock = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    dispatchSpy = mockUseDispatch().scopeDispatch;
    getUserSpy = mockGetCurrentUser();
    useLocationMock.mockReturnValue({
      pathname: '/rule',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
    useHistoryMock.mockReturnValue({
      replace: replaceMock,
    });
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    useLocationMock.mockRestore();
    useHistoryMock.mockRestore();
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
    expect(replaceMock).toBeCalledTimes(1);
    expect(replaceMock).nthCalledWith(
      1,
      `/login?${SQLE_REDIRECT_KEY_PARAMS_NAME}=/rule`
    );
  });
});
