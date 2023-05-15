import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useUserInfo from '.';
import { SQLE_REDIRECT_KEY_PARAMS_NAME } from '../../data/common';
import {
  mockGetCurrentUser,
  resolveErrorThreeSecond,
} from '../../testUtils/mockRequest';
import useNavigate from '../useNavigate';
import {
  mockBindProjects,
  mockManagementPermissions,
} from '../useCurrentUser/index.test.data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  };
});

jest.mock('../../hooks/useNavigate', () => jest.fn());

describe('test useUserInfo', () => {
  let getUserSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();

  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  const useHistoryMock: jest.Mock = useNavigate as jest.Mock;
  beforeEach(() => {
    jest.useFakeTimers();
    getUserSpy = mockGetCurrentUser();
    useLocationMock.mockReturnValue({
      pathname: '/rule',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    useHistoryMock.mockImplementation(() => navigateSpy);
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
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(
      1,
      `/login?${SQLE_REDIRECT_KEY_PARAMS_NAME}=/rule`,
      { replace: true }
    );
  });
});
