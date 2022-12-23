import ProjectDetail, { useRecentlyOpenedProjects } from '.';
import { mockUseDispatch } from '../../../testUtils/mockRedux';
import { useParams } from 'react-router-dom';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test';
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../testUtils/customRender';
import {
  mockUseAuditPlanTypes,
  mockUseInstance,
  mockUseUsername,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import user from '../../../api/user';
import {
  mockGetProjectDetail,
  mockGetProjectStatistics,
} from '../__test__/utils';
import { mockUseStyle } from '../../../testUtils/mockStyle';
import { act, renderHook } from '@testing-library/react-hooks/dom';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import StorageKey from '../../../data/StorageKey';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = mockBindProjects[0].project_name;

describe('test ProjectManage/ProjectDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getUserSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  beforeEach(() => {
    getUserSpy = jest.spyOn(user, 'getCurrentUserV1');
    getUserSpy.mockImplementation(() =>
      resolveThreeSecond({
        user_name: 'test',
        is_admin: '',
        bind_projects: mockBindProjects,
      })
    );

    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseAuditPlanTypes();
    mockUseUsername();
    mockUseInstance();
    mockUseStyle();

    useParamsMock.mockReturnValue({ projectName });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
  });
  test('should render tips for unbound project', async () => {
    getUserSpy.mockImplementation(() =>
      resolveThreeSecond({
        user_name: 'test',
        is_admin: '',
        bind_projects: [],
      })
    );
    expect(getUserSpy).toBeCalledTimes(0);

    render(<ProjectDetail />);
    expect(getUserSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('projectManage.projectDetail.unboundProjectTips')
    ).toBeInTheDocument();
  });

  test('should clear user info when get current user is wrong', async () => {
    getUserSpy.mockImplementation(() => resolveErrorThreeSecond(undefined));
    expect(dispatchSpy).toBeCalledTimes(0);
    render(<ProjectDetail />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(dispatchSpy).toBeCalledTimes(3);
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
  });

  test('should match snapshot when bound project exists', async () => {
    const getProjectDetailSpy = mockGetProjectDetail();
    const getProjectStatistics = mockGetProjectStatistics();
    const { container } = renderWithRouter(<ProjectDetail />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(container).toMatchSnapshot();
    expect(getProjectDetailSpy).toBeCalledTimes(1);
    expect(getProjectStatistics).toBeCalledTimes(1);
  });
});

describe('test useRecentlyOpenedProjects', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test('should perform as expected with update operation', async () => {
    const localStorageSetItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useRecentlyOpenedProjects());

    expect(localStorageSetItemSpy).toBeCalledTimes(0);

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    act(() => {
      result.current.updateRecentlyProject('default1');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(1);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify(['default1'])
    );

    expect(result.current.recentlyProjects).toEqual(['default1']);

    act(() => {
      result.current.updateRecentlyProject('default2');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(2);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify(['default2', 'default1'])
    );

    expect(result.current.recentlyProjects).toEqual(['default2', 'default1']);

    act(() => {
      result.current.updateRecentlyProject('default3');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(3);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify(['default3', 'default2', 'default1'])
    );

    expect(result.current.recentlyProjects).toEqual([
      'default3',
      'default2',
      'default1',
    ]);

    act(() => {
      result.current.updateRecentlyProject('default4');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(4);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify(['default4', 'default3', 'default2'])
    );

    expect(result.current.recentlyProjects).toEqual([
      'default4',
      'default3',
      'default2',
    ]);

    act(() => {
      result.current.updateRecentlyProject('default3');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(5);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify(['default3', 'default4', 'default2'])
    );

    expect(result.current.recentlyProjects).toEqual([
      'default3',
      'default4',
      'default2',
    ]);

    window.localStorage.clear();
  });

  test('should be an empty array when no update operation is performed', () => {
    const subscribeSpy = jest.spyOn(EventEmitter, 'subscribe');
    const unsubscribeSpy = jest.spyOn(EventEmitter, 'unsubscribe');

    const { result, unmount } = renderHook(() => useRecentlyOpenedProjects());

    expect(result.current.recentlyProjects).toEqual([]);

    expect(unsubscribeSpy).toBeCalledTimes(0);
    expect(subscribeSpy).toBeCalledTimes(1);
    expect(subscribeSpy.mock.calls[0][0]).toBe(
      EmitterKey.Update_Recently_Opened_Projects
    );

    unmount();

    expect(unsubscribeSpy).toBeCalledTimes(1);
    expect(unsubscribeSpy.mock.calls[0][0]).toBe(
      EmitterKey.Update_Recently_Opened_Projects
    );
  });
});
