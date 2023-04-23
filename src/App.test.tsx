import { cleanup, render, act } from '@testing-library/react';
import { shallow } from 'enzyme';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, useLocation } from 'react-router-dom';
import global from './api/global';
import App, { Wrapper } from './App';
import {
  SQLE_DEFAULT_WEB_TITLE,
  SQLE_REDIRECT_KEY_PARAMS_NAME,
  SystemRole,
} from './data/common';
import { ModalName } from './data/ModalName';
import {
  mockBindProjects,
  mockManagementPermissions,
} from './hooks/useCurrentUser/index.test';
import useNavigate from './hooks/useNavigate';
import { mockGetCurrentUser } from './hooks/useUserInfo/index.test';
import { SupportLanguage } from './locale';
import {
  mockUseAuditPlanTypes,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from './testUtils/mockRequest';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

jest.mock('./hooks/useNavigate', () => jest.fn());

describe('App test', () => {
  let getUserSpy: jest.SpyInstance;
  const scopeDispatch = jest.fn();
  const navigateSpy = jest.fn();
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  const useHistoryMock: jest.Mock = useNavigate as jest.Mock;
  let getSqleInfoSpy: jest.SpyInstance;

  beforeEach(() => {
    getUserSpy = mockGetCurrentUser();
    getSqleInfoSpy = mockGetSqleInfo();

    mockUseAuditPlanTypes();
    jest.useFakeTimers();
    useLocationMock.mockReturnValue({
      pathname: '/rule',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    useLocationMock.mockRestore();
    useHistoryMock.mockRestore();
  });

  const mockGetSqleInfo = () => {
    const spy = jest.spyOn(global, 'getSQLEInfoV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        title: 'SQLE',
        logo_url: 'test',
      })
    );
    return spy;
  };

  test('should render App Wrapper', () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { token: '' },
      })
    );
    render(<Wrapper>children</Wrapper>);

    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(
      1,
      `/login?${SQLE_REDIRECT_KEY_PARAMS_NAME}=/rule`
    );
    cleanup();
    navigateSpy.mockClear();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { token: 'token' },
      })
    );
    render(<Wrapper>children</Wrapper>);
    expect(navigateSpy).toBeCalledTimes(0);
    cleanup();
    navigateSpy.mockClear();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { token: '' },
      })
    );
    useLocationMock.mockReturnValue({
      pathname: '/login',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
    render(<Wrapper>children</Wrapper>);
    expect(navigateSpy).toBeCalledTimes(0);
    cleanup();
    navigateSpy.mockClear();

    useLocationMock.mockReturnValue({
      pathname: '/user/bind',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
    render(<Wrapper>children</Wrapper>);
    expect(navigateSpy).toBeCalledTimes(0);
    cleanup();
    navigateSpy.mockClear();
  });

  test.skip('should render login route when token is falsy', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { token: '', role: '' },
        locale: { language: SupportLanguage.zhCN },
      })
    );

    const wrapper = shallow(<App />);
    const route = wrapper.find('Route');
    expect(route.length).toBe(2);
    expect(route.at(0).prop('path')).toBe('/login');
    const redirect = wrapper.find('Redirect');
    expect(redirect.length).toBe(1);
    expect(redirect.at(0).prop('to')).toBe('/login');
  });

  test.skip('should render Nav and inner route when token is truthy and role is admin', () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { token: 'testToken', role: SystemRole.admin },
        locale: { language: SupportLanguage.zhCN },
      })
    );
    const wrapper = shallow(<App />);
    const Nav = wrapper.find('Nav');
    expect(Nav.length).toBe(1);
    const Switch = Nav.find('Switch');
    expect(Switch.length).toBe(1);
    const routes = Switch.find('Route');
    expect(routes.length).toBe(12);
    const redirect = Switch.find('Redirect');
    expect(redirect.length).toBe(1);
    expect(redirect.at(0).prop('to')).toBe('/');
  });

  test.skip('should render Nav and some inner route when token is truthy and role is not admin', () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { token: 'testToken', role: '' },
        locale: { language: SupportLanguage.zhCN },
      })
    );
    const wrapper = shallow(<App />);
    const Nav = wrapper.find('Nav');
    expect(Nav.length).toBe(1);
    const Switch = Nav.find('Switch');
    expect(Switch.length).toBe(1);
    const routes = Switch.find('Route');
    expect(routes.length).toBe(10);
    const redirect = Switch.find('Redirect');
    expect(redirect.length).toBe(1);
    expect(redirect.at(0).prop('to')).toBe('/');
  });

  test('should get user info when token is not empty', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { token: 'testToken', role: '' },
        locale: { language: SupportLanguage.zhCN },
        nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
        system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
      })
    );
    getUserSpy.mockImplementation(() =>
      resolveThreeSecond({
        user_name: 'username',
        is_admin: '',
        bind_projects: mockBindProjects,
        management_permission_list: mockManagementPermissions,
      })
    );
    expect(scopeDispatch).not.toBeCalled();
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(scopeDispatch).toBeCalledTimes(5);
    expect(scopeDispatch.mock.calls[2][0]).toEqual({
      payload: {
        bindProjects: mockBindProjects,
      },
      type: 'user/updateBindProjects',
    });
    expect(scopeDispatch.mock.calls[3][0]).toEqual({
      payload: {
        role: '',
        username: 'username',
      },
      type: 'user/updateUser',
    });
    expect(scopeDispatch.mock.calls[4][0]).toEqual({
      payload: {
        managementPermissions: mockManagementPermissions,
      },
      type: 'user/updateManagementPermissions',
    });

    scopeDispatch.mockClear();
    getUserSpy.mockImplementation(() =>
      resolveErrorThreeSecond({
        user_name: 'username',
        is_admin: SystemRole.admin,
      })
    );

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(scopeDispatch).toBeCalledTimes(6);
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        modalStatus: {
          SHOW_VERSION: false,
        },
      },
      type: 'nav/initModalStatus',
    });
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        bindProjects: [],
      },
      type: 'user/updateBindProjects',
    });
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        role: '',
        username: '',
      },
      type: 'user/updateUser',
    });
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        token: '',
      },
      type: 'user/updateToken',
    });
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        managementPermissions: [],
      },
      type: 'user/updateManagementPermissions',
    });
  });

  test('should dispatch "updateWebTitleAndLog" action and set document title after getting sqle data from the request', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
        user: { token: 'token', role: '' },
        locale: { language: SupportLanguage.zhCN },
        nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
      })
    );
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(getSqleInfoSpy).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(document.title).toBe('SQLE');
    expect(scopeDispatch).toBeCalledTimes(5);
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        webLogoUrl: 'test',
        webTitle: 'SQLE',
      },
      type: 'system/updateWebTitleAndLog',
    });
  });

  test('should set default title when the fetched title is undefined', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
        user: { token: 'token', role: '' },
        locale: { language: SupportLanguage.zhCN },
        nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
      })
    );

    getSqleInfoSpy.mockImplementation(() => resolveThreeSecond({}));
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(document.title).toBe(SQLE_DEFAULT_WEB_TITLE);
  });

  test('should not get user info when token is empty', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { token: '', role: '' },
        locale: { language: SupportLanguage.zhCN },
        system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
      })
    );
    expect(scopeDispatch).not.toBeCalled();
    expect(getUserSpy).not.toBeCalled();
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(scopeDispatch).not.toBeCalled();
    expect(getUserSpy).not.toBeCalled();
  });
});
