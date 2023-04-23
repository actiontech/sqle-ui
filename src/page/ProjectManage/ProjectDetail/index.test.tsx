import ProjectDetail, { useRecentlyOpenedProjects } from '.';
import { useLocation, useParams } from 'react-router-dom';
import {
  mockBindProjects,
  mockManagementPermissions,
} from '../../../hooks/useCurrentUser/index.test';
import { render, screen, act as reactAct } from '@testing-library/react';
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
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import StorageKey from '../../../data/StorageKey';
import { SystemRole } from '../../../data/common';
import { act, renderHook } from '@testing-library/react-hooks';
import useNavigate from '../../../hooks/useNavigate';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

jest.mock('../../../hooks/useNavigate', () => jest.fn());

const projectName = mockBindProjects[0].project_name;

describe('test ProjectManage/ProjectDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getUserSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let getProjectDetailSpy: jest.SpyInstance;
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  const useHistoryMock: jest.Mock = useNavigate as jest.Mock;
  const navigateSpy = jest.fn();
  beforeEach(() => {
    getUserSpy = jest.spyOn(user, 'getCurrentUserV1');
    getUserSpy.mockImplementation(() =>
      resolveThreeSecond({
        user_name: 'test',
        is_admin: '',
        bind_projects: mockBindProjects,
      })
    );
    getProjectDetailSpy = mockGetProjectDetail();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);

    mockUseAuditPlanTypes();
    mockUseUsername();
    mockUseInstance();
    mockUseStyle();
    useLocationMock.mockReturnValue({
      pathname: '/project/default/overview',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
    useHistoryMock.mockImplementation(() => navigateSpy);
    useParamsMock.mockReturnValue({ projectName });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
    useLocationMock.mockRestore();
    useHistoryMock.mockRestore();
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
    expect(getProjectDetailSpy).toBeCalledTimes(1);
    await reactAct(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('projectManage.projectDetail.unboundProjectTips')
    ).toBeInTheDocument();
  });

  test('should clear user info when get current user is wrong', async () => {
    getUserSpy.mockImplementation(() => resolveErrorThreeSecond(undefined));
    expect(dispatchSpy).toBeCalledTimes(0);
    render(<ProjectDetail />);
    await reactAct(async () => jest.advanceTimersByTime(3000));

    expect(dispatchSpy).toBeCalledTimes(5);
    expect(dispatchSpy).nthCalledWith(1, {
      payload: false,
      type: 'projectManage/updateProjectStatus',
    });
    expect(dispatchSpy).nthCalledWith(2, {
      payload: { bindProjects: [] },
      type: 'user/updateBindProjects',
    });
    expect(dispatchSpy).nthCalledWith(3, {
      payload: { username: '', role: '' },
      type: 'user/updateUser',
    });
    expect(dispatchSpy).nthCalledWith(4, {
      payload: { token: '' },
      type: 'user/updateToken',
    });
    expect(dispatchSpy).nthCalledWith(5, {
      payload: { managementPermissions: [] },
      type: 'user/updateManagementPermissions',
    });
  });

  test('should match snapshot when bound project exists', async () => {
    const { container } = renderWithRouter(<ProjectDetail />);
    await reactAct(async () => jest.advanceTimersByTime(3000));
    await reactAct(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
    expect(getProjectDetailSpy).toBeCalledTimes(1);
  });

  test('should show unavailable when project archived is equal true', async () => {
    mockGetProjectStatistics();
    getProjectDetailSpy.mockImplementation(() =>
      resolveThreeSecond({
        create_time: '2022-01-01',
        create_user_name: 'admin',
        desc: 'desc',
        name: 'project1',
        archived: true,
      })
    );

    const { container } = renderWithRouter(<ProjectDetail />);
    await reactAct(async () => jest.advanceTimersByTime(3000));
    await reactAct(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('(projectManage.projectList.column.unavailable)')
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

describe('test useRecentlyOpenedProjects', () => {
  const username1 = 'admin';
  const username2 = 'test';

  const bindProjects = [
    {
      is_manager: true,
      project_name: 'default',
    },
    {
      is_manager: false,
      project_name: 'default1',
    },
    {
      is_manager: false,
      project_name: 'default2',
    },
    {
      is_manager: false,
      project_name: 'default3',
    },
    {
      is_manager: false,
      project_name: 'default4',
    },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          username: username1,
          role: SystemRole.admin,
          bindProjects: bindProjects,
          managementPermissions: mockManagementPermissions,
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test('should perform as expected with update operation', () => {
    const localStorageSetItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useRecentlyOpenedProjects());

    expect(localStorageSetItemSpy).toBeCalledTimes(0);

    act(() => {
      result.current.updateRecentlyProject('default1');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(1);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify({ [username1]: ['default1'] })
    );

    expect(result.current.recentlyProjects).toEqual(['default1']);

    act(() => {
      result.current.updateRecentlyProject('default2');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(2);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify({ [username1]: ['default2', 'default1'] })
    );

    expect(result.current.recentlyProjects).toEqual(['default2', 'default1']);

    act(() => {
      result.current.updateRecentlyProject('default3');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(3);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify({ [username1]: ['default3', 'default2', 'default1'] })
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
      JSON.stringify({ [username1]: ['default4', 'default3', 'default2'] })
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
      JSON.stringify({ [username1]: ['default3', 'default4', 'default2'] })
    );

    expect(result.current.recentlyProjects).toEqual([
      'default3',
      'default4',
      'default2',
    ]);

    window.localStorage.clear();
  });

  test('should be distinguished projects by users and filtering out projects that do not have permissions', () => {
    const localStorageSetItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result, rerender } = renderHook(() => useRecentlyOpenedProjects());

    expect(localStorageSetItemSpy).toBeCalledTimes(0);

    act(() => {
      result.current.updateRecentlyProject('default1');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(1);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify({ [username1]: ['default1'] })
    );
    expect(result.current.recentlyProjects).toEqual(['default1']);
    jest.clearAllMocks();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          username: username2,
          role: SystemRole.admin,
          bindProjects: bindProjects,
          managementPermissions: mockManagementPermissions,
        },
      })
    );

    rerender();

    act(() => {
      result.current.updateRecentlyProject('default1');
    });

    expect(localStorageSetItemSpy).toBeCalledTimes(1);
    expect(localStorageSetItemSpy).toBeCalledWith(
      StorageKey.Project_Catch,
      JSON.stringify({ [username1]: ['default1'], [username2]: ['default1'] })
    );
    expect(result.current.recentlyProjects).toEqual(['default1']);

    jest.clearAllMocks();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          username: username2,
          role: SystemRole.admin,
          bindProjects: [],
          managementPermissions: mockManagementPermissions,
        },
      })
    );

    rerender();
    expect(result.current.recentlyProjects).toEqual([]);
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
