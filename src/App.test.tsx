import { render, waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import user from './api/user';
import App from './App';
import { SystemRole } from './data/common';
import { ModalName } from './data/ModalName';
import {
  mockBindProjects,
  mockManagementPermissions,
} from './hooks/useCurrentUser/index.test';
import { SupportLanguage } from './locale';
import { mockUseDispatch, mockUseSelector } from './testUtils/mockRedux';
import {
  mockUseAuditPlanTypes,
  resolveErrorThreeSecond,
  resolveImmediately,
  resolveThreeSecond,
} from './testUtils/mockRequest';

describe('App test', () => {
  let getUserSpy: jest.SpyInstance;
  let scopeDispatch: jest.SpyInstance;

  beforeEach(() => {
    getUserSpy = jest.spyOn(user, 'getCurrentUserV1');
    getUserSpy.mockImplementation(() =>
      resolveImmediately({
        user_name: 'test',
        is_admin: '',
        bindProjects: mockBindProjects,
        management_permission_list: mockManagementPermissions,
      })
    );
    const { scopeDispatch: temp } = mockUseDispatch();
    scopeDispatch = temp;
    mockUseAuditPlanTypes();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should render login route when token is falsy', () => {
    mockUseSelector({
      user: { token: '', role: '' },
      locale: { language: SupportLanguage.zhCN },
    });
    const wrapper = shallow(<App />);
    const route = wrapper.find('Route');
    expect(route.length).toBe(2);
    expect(route.at(0).prop('path')).toBe('/login');
    const redirect = wrapper.find('Redirect');
    expect(redirect.length).toBe(1);
    expect(redirect.at(0).prop('to')).toBe('/login');
  });

  test('should render Nav and inner route when token is truthy and role is admin', () => {
    mockUseSelector({
      user: { token: 'testToken', role: SystemRole.admin },
      locale: { language: SupportLanguage.zhCN },
    });
    const wrapper = shallow(<App />);
    const Nav = wrapper.find('Nav');
    expect(Nav.length).toBe(1);
    const Switch = Nav.find('Switch');
    expect(Switch.length).toBe(1);
    const routes = Switch.find('Route');
    expect(routes.length).toBe(11);
    const redirect = Switch.find('Redirect');
    expect(redirect.length).toBe(1);
    expect(redirect.at(0).prop('to')).toBe('/');
  });

  test('should render Nav and some inner route when token is truthy and role is not admin', () => {
    mockUseSelector({
      user: { token: 'testToken', role: '' },
      locale: { language: SupportLanguage.zhCN },
    });
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
    mockUseSelector({
      user: { token: 'testToken', role: '' },
      locale: { language: SupportLanguage.zhCN },
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
    });
    getUserSpy.mockImplementation(() =>
      resolveThreeSecond({
        user_name: 'username',
        is_admin: '',
        bind_projects: mockBindProjects,
        management_permission_list: mockManagementPermissions,
      })
    );
    expect(scopeDispatch).not.toBeCalled();
    render(<App />);
    await waitFor(() => jest.advanceTimersByTime(3000));
    expect(scopeDispatch).toBeCalledTimes(4);
    expect(scopeDispatch.mock.calls[1][0]).toEqual({
      payload: {
        bindProjects: mockBindProjects,
      },
      type: 'user/updateBindProjects',
    });
    expect(scopeDispatch.mock.calls[2][0]).toEqual({
      payload: {
        role: '',
        username: 'username',
      },
      type: 'user/updateUser',
    });
    expect(scopeDispatch.mock.calls[3][0]).toEqual({
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

    render(<App />);
    await waitFor(() => jest.advanceTimersByTime(3000));
    expect(scopeDispatch).toBeCalledTimes(5);
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

  test('should not get user info when token is empty', () => {
    mockUseSelector({
      user: { token: '', role: '' },
      locale: { language: SupportLanguage.zhCN },
    });
    const scopeDispatch = jest.fn();
    const getUserFn = jest.fn();
    getUserSpy.mockImplementation(() => getUserFn);
    expect(scopeDispatch).not.toBeCalled();
    expect(getUserFn).not.toBeCalled();
    render(<App />);
    expect(scopeDispatch).not.toBeCalled();
    expect(scopeDispatch).not.toBeCalled();
  });
});
