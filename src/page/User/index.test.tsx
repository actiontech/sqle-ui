import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import User from '.';
import role from '../../api/role';
import user from '../../api/user';
import { mockUseDispatch, mockUseSelector } from '../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseRole,
  mockUseUsername,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';

describe('User', () => {
  let dispatchMock!: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    const { scopeDispatch } = mockUseDispatch();
    dispatchMock = scopeDispatch;
    mockUseRole();
    mockUseUsername();
    mockUseInstance();
    mockUseSelector({ userManage: { modalStatus: {} } });
    mockGetUseList();
    mockGetUserRoleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    dispatchMock.mockClear();
  });

  const mockGetUseList = () => {
    const spy = jest.spyOn(user, 'getUserListV1');
    spy.mockImplementation(() => resolveThreeSecond([]));
    return spy;
  };

  const mockGetUserRoleList = () => {
    const spy = jest.spyOn(role, 'getRoleListV1');
    spy.mockImplementation(() => resolveThreeSecond([]));
    return spy;
  };

  test('should match snapshot', () => {
    const wrapper = shallow(<User />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should init modal state at component init', () => {
    render(<User />);
    expect(dispatchMock).toBeCalledTimes(1);
    expect(dispatchMock).toBeCalledWith({
      payload: {
        modalStatus: {
          ADD_ROLE: false,
          ADD_USER: false,
          UPDATE_ROLE: false,
          Update_User: false,
        },
      },
      type: 'user/initModalStatus',
    });
  });
});
