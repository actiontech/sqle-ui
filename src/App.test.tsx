import { render, waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import user from './api/user';
import App from './App';
import { SystemRole } from './data/common';
import { ModalName } from './data/ModalName';
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
      resolveImmediately({ user_name: 'test', is_admin: '' })
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
    expect(routes.length).toBe(12);
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
    expect(routes.length).toBe(11);
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
      resolveThreeSecond({ user_name: 'username', is_admin: '' })
    );
    expect(scopeDispatch).not.toBeCalled();
    render(<App />);
    await waitFor(() => jest.advanceTimersByTime(3000));
    expect(scopeDispatch).toBeCalledTimes(2);
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        role: '',
        username: 'username',
      },
      type: 'user/updateUser',
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
    expect(scopeDispatch).toBeCalledTimes(3);
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
