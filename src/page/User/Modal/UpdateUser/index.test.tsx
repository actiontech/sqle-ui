import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import UpdateUser from '.';
import user from '../../../../api/user';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import {
  mockUseRole,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';

describe('User/Modal/AddUser', () => {
  let userRoleSpy: jest.SpyInstance;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    userRoleSpy = mockUseRole();
    mockUseSelector({
      userManage: {
        modalStatus: { [ModalName.Update_User]: true },
        selectUser: {
          user_name: 'root',
          email: 'user@123.com',
          role_name_list: ['role_name1'],
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
    cleanup();
    userRoleSpy.mockClear();
    mockUseSelector({
      userManage: { modalStatus: { [ModalName.Update_User]: false } },
    });
    render(<UpdateUser />);
    expect(userRoleSpy).not.toBeCalled();
  });

  test('should send create role request when user click submit button', async () => {
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
      role_name_list: ['role_name1'],
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('user.updateUser.updateSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).nthCalledWith(1, EmitterKey.Refresh_Role_list);
    expect(emitSpy).nthCalledWith(2, EmitterKey.Refresh_User_list);
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
      role_name_list: ['role_name1'],
    });
  });
});
