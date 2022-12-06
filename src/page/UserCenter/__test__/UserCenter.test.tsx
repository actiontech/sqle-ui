import { fireEvent, screen, waitFor } from '@testing-library/react';
import UserCenter from '..';
import role from '../../../api/role';
import user from '../../../api/user';
import user_group from '../../../api/user_group';
import { renderWithRedux } from '../../../testUtils/customRender';
import { mockUseDispatch } from '../../../testUtils/mockRedux';
import {
  mockUseRole,
  mockUseUserGroup,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { RoleListData } from '../Role/RoleList/__testData__';
import { UserListData } from '../User/UserList/__testData__';
import { userGroupList } from '../UserGroup/UserGroupList/__testData__';

describe('first', () => {
  let getUserListSpy: jest.SpyInstance;
  let getRoleListSpy: jest.SpyInstance;
  let getUserGroupListSpy: jest.SpyInstance;

  const mockGetUserList = () => {
    const spy = jest.spyOn(user, 'getUserListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(UserListData, { otherData: { total_nums: 11 } })
    );
    return spy;
  };
  const mockGetRoleList = () => {
    const spy = jest.spyOn(role, 'getRoleListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(RoleListData, { otherData: { total_nums: 11 } })
    );
    return spy;
  };
  const mockGetUserGroupList = () => {
    const spy = jest.spyOn(user_group, 'getUserGroupListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(userGroupList, {
        otherData: {
          total_nums: 62,
        },
      })
    );
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseUsername();
    mockUseUserGroup();
    mockUseRole();
    mockUseDispatch();
    getUserListSpy = mockGetUserList();
    getRoleListSpy = mockGetRoleList();
    getUserGroupListSpy = mockGetUserGroupList();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should be rendered UserManage page when it first entered the user center', async () => {
    const { container } = renderWithRedux(<UserCenter />);
    expect(getUserListSpy).toBeCalledTimes(1);
    expect(getRoleListSpy).toBeCalledTimes(0);
    expect(getUserGroupListSpy).toBeCalledTimes(0);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText('menu.user').parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
    expect(container).toMatchSnapshot();
  });

  test('should get corresponding data when switching tabs', async () => {
    renderWithRedux(<UserCenter />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByText('menu.role'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('menu.role').parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
    expect(getRoleListSpy).toBeCalledTimes(1);

    fireEvent.click(screen.getByText('menu.userGroup'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('menu.userGroup').parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );
    expect(getUserGroupListSpy).toBeCalledTimes(1);
  });
});
