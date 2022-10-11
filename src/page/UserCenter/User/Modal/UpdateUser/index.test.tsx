import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import UpdateUser from '.';
import user from '../../../../../api/user';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import {
  mockUseRole,
  mockUseUserGroup,
  resolveThreeSecond,
} from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';

describe('User/Modal/AddUser', () => {
  let userRoleSpy: jest.SpyInstance;
  let useUserGroupSpy: jest.SpyInstance;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    userRoleSpy = mockUseRole();
    useUserGroupSpy = mockUseUserGroup();
    mockUseSelector({
      userManage: {
        modalStatus: { [ModalName.Update_User]: true },
        selectUser: {
          user_name: 'root',
          email: 'user@123.com',
          role_name_list: ['role_name1'],
          user_group_name_list: ['user_group_name1'],
          wechat_id: '11231123',
        },
      },
    });
    const { scopeDispatch } = mockUseDispatch();
    dispatchSpy = scopeDispatch;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should get instance list and username list when modal is opened', async () => {
    render(<UpdateUser />);
    expect(userRoleSpy).toBeCalledTimes(1);
    expect(useUserGroupSpy).toBeCalledTimes(1);
    cleanup();
    userRoleSpy.mockClear();
    useUserGroupSpy.mockClear();
    mockUseSelector({
      userManage: { modalStatus: { [ModalName.Update_User]: false } },
    });
    render(<UpdateUser />);
    expect(userRoleSpy).not.toBeCalled();
    expect(useUserGroupSpy).not.toBeCalled();
  });

  test('should send update user request when user click submit button', async () => {
    render(<UpdateUser />);
    const updateUserSpy = jest.spyOn(user, 'updateUserV1');
    updateUserSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByLabelText('user.userForm.username')).toHaveValue('root');
    expect(screen.getByLabelText('user.userForm.username')).toHaveAttribute(
      'disabled'
    );
    expect(
      screen.queryByLabelText('user.userForm.password')
    ).not.toBeInTheDocument();

    fireEvent.input(screen.getByLabelText('user.userForm.email'), {
      target: { value: 'newuser@163.com' },
    });

    fireEvent.click(screen.getByText('user.userForm.disabled'));

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toHaveAttribute(
      'disabled'
    );
    expect(updateUserSpy).toBeCalledTimes(1);
    expect(updateUserSpy).toBeCalledWith({
      email: 'newuser@163.com',
      user_name: 'root',
      is_disabled: true,
      role_name_list: ['role_name1'],
      user_group_name_list: ['user_group_name1'],
      wechat_id: '11231123',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('user.updateUser.updateSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_User_list);
    expect(screen.getByLabelText('user.userForm.username')).toHaveValue('');
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'Update_User',
        status: false,
      },
      type: 'user/updateModalStatus',
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  test('should send update user request when the username is any value', async () => {
    userRoleSpy.mockClear();
    mockUseSelector({
      userManage: {
        modalStatus: { [ModalName.Update_User]: true },
        selectUser: {
          user_name: 'san.zhang',
          email: 'user@123.com',
          role_name_list: ['role_name1'],
        },
      },
    });
    render(<UpdateUser />);
    expect(userRoleSpy).toBeCalledTimes(1);

    const updateUserSpy = jest.spyOn(user, 'updateUserV1');
    updateUserSpy.mockImplementation(() => resolveThreeSecond({}));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByLabelText('user.userForm.username')).toHaveValue(
      'san.zhang'
    );

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(userRoleSpy).toBeCalledTimes(1);
    expect(updateUserSpy).toBeCalledWith({
      email: 'user@123.com',
      user_name: 'san.zhang',
      is_disabled: false,
      role_name_list: ['role_name1'],
      user_group_name_list: [],
    });
  });

  test('should not set disable filed when user name is admin', async () => {
    userRoleSpy.mockClear();
    mockUseSelector({
      userManage: {
        modalStatus: { [ModalName.Update_User]: true },
        selectUser: {
          user_name: 'admin',
          email: 'user@123.com',
          role_name_list: ['role_name1'],
        },
      },
    });
    render(<UpdateUser />);
    expect(userRoleSpy).toBeCalledTimes(1);

    const updateUserSpy = jest.spyOn(user, 'updateUserV1');
    updateUserSpy.mockImplementation(() => resolveThreeSecond({}));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByLabelText('user.userForm.disabled')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(userRoleSpy).toBeCalledTimes(1);
    expect(updateUserSpy).toBeCalledWith({
      email: 'user@123.com',
      user_name: 'admin',
      role_name_list: ['role_name1'],
      user_group_name_list: [],
    });
  });

  test('should send update user request when user clear email', async () => {
    userRoleSpy.mockClear();
    mockUseSelector({
      userManage: {
        modalStatus: { [ModalName.Update_User]: true },
        selectUser: {
          user_name: 'san.zhang',
          email: 'user@123.com',
          role_name_list: ['role_name1'],
        },
      },
    });
    render(<UpdateUser />);
    expect(userRoleSpy).toBeCalledTimes(1);

    const updateUserSpy = jest.spyOn(user, 'updateUserV1');
    updateUserSpy.mockImplementation(() => resolveThreeSecond({}));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByLabelText('user.userForm.username')).toHaveValue(
      'san.zhang'
    );

    fireEvent.input(screen.getByLabelText('user.userForm.email'), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(userRoleSpy).toBeCalledTimes(1);
    expect(updateUserSpy).toBeCalledWith({
      email: '',
      user_name: 'san.zhang',
      is_disabled: false,
      role_name_list: ['role_name1'],
      user_group_name_list: [],
    });
  });
});
