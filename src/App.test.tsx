import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import user from './api/user';
import App from './App';
import { SystemRole } from './data/common';
import { SupportLanguage } from './locale';
import { mockUseDispatch, mockUseSelector } from './testUtils/mockRedux';
import { resolveImmediately } from './testUtils/mockRequest';

describe('App test', () => {
  let getUserSpy: jest.SpyInstance;

  beforeEach(() => {
    getUserSpy = jest.spyOn(user, 'getCurrentUserV1');
    getUserSpy.mockReturnValue(() =>
      resolveImmediately({ user_name: 'test', is_admin: '' })
    );
    mockUseDispatch();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should render login route when token is falsy', () => {
    mockUseSelector({
      user: { token: '', role: '' },
      locale: { language: SupportLanguage.zhCN },
    });
    const wrapper = shallow(<App />);
    jest.runAllTimers();

    const route = wrapper.find('Route');
    expect(route.length).toBe(1);
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
    expect(routes.length).toBe(6);
    const redirect = Switch.find('Redirect');
    expect(redirect.length).toBe(1);
    expect(redirect.at(0).prop('to')).toBe('/');
  });
});
