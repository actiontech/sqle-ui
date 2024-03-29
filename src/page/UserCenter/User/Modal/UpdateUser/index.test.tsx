import {
  cleanup,
  fireEvent,
  render,
  act,
  screen,
} from '@testing-library/react';
import UpdateUser from '.';
import user from '../../../../../api/user';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';

import {
  mockManagerPermission,
  mockUseUserGroup,
  resolveThreeSecond,
} from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('User/Modal/UpdateUser', () => {
  let useUserGroupSpy: jest.SpyInstance;
  let managerPermissionSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    useUserGroupSpy = mockUseUserGroup();
    managerPermissionSpy = mockManagerPermission();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: { [ModalName.Update_User]: true },
          selectUser: {
            user_name: 'root',
            email: 'user@123.com',
            management_permission_list: [
              {
                desc: '创建项目',
                code: 1,
              },
            ],
            user_group_name_list: ['user_group_name1'],
            wechat_id: '11231123',
            phone: '13312341234',
            is_disabled: false,
          },
        },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { baseElement, rerender } = render(<UpdateUser />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: { [ModalName.Update_User]: true },
          selectUser: {
            user_name: 'root',
            email: 'user@123.com',
            management_permission_list: [
              {
                desc: '创建项目',
                code: 1,
              },
            ],
            user_group_name_list: ['user_group_name1'],
            wechat_id: '11231123',
            phone: '13312341234',
            is_disabled: false,
          },
        },
      })
    );

    rerender(<UpdateUser />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
  });

  test('should get instance list and username list when modal is opened', async () => {
    render(<UpdateUser />);
    expect(managerPermissionSpy).toBeCalledTimes(1);
    expect(useUserGroupSpy).toBeCalledTimes(1);
    expect(managerPermissionSpy).toBeCalledTimes(1);
    cleanup();
    managerPermissionSpy.mockClear();
    useUserGroupSpy.mockClear();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: { modalStatus: { [ModalName.Update_User]: false } },
      })
    );
    render(<UpdateUser />);
    expect(managerPermissionSpy).not.toBeCalled();
    expect(useUserGroupSpy).not.toBeCalled();
  });

  test('should send update user request when user click submit button', async () => {
    render(<UpdateUser />);
    const updateUserSpy = jest.spyOn(user, 'updateUserV1');
    updateUserSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    await act(async () => jest.advanceTimersByTime(3000));

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
    await act(async () => jest.advanceTimersByTime(0));

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
      management_permission_code_list: [1],
      user_group_name_list: ['user_group_name1'],
      wechat_id: '11231123',
      phone: '13312341234',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('user.updateUser.updateSuccessTips')
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
    managerPermissionSpy.mockClear();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: { [ModalName.Update_User]: true },
          selectUser: {
            user_name: 'san.zhang',
            email: 'user@123.com',
            phone: '13312341234',

            management_permission_list: [
              {
                desc: '创建项目',
                code: 1,
              },
            ],
          },
        },
      })
    );

    render(<UpdateUser />);
    expect(managerPermissionSpy).toBeCalledTimes(1);

    const updateUserSpy = jest.spyOn(user, 'updateUserV1');
    updateUserSpy.mockImplementation(() => resolveThreeSecond({}));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByLabelText('user.userForm.username')).toHaveValue(
      'san.zhang'
    );

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(managerPermissionSpy).toBeCalledTimes(1);
    expect(updateUserSpy).toBeCalledWith({
      email: 'user@123.com',
      user_name: 'san.zhang',
      is_disabled: false,
      management_permission_code_list: [1],
      user_group_name_list: [],
      phone: '13312341234',
    });
  });

  test('should not set disable filed when user name is admin', async () => {
    managerPermissionSpy.mockClear();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: { [ModalName.Update_User]: true },
          selectUser: {
            user_name: 'admin',
            email: 'user@123.com',
            phone: '13312341234',

            management_permission_list: [
              {
                desc: '创建项目',
                code: 1,
              },
            ],
          },
        },
      })
    );
    render(<UpdateUser />);
    expect(managerPermissionSpy).toBeCalledTimes(1);

    const updateUserSpy = jest.spyOn(user, 'updateUserV1');
    updateUserSpy.mockImplementation(() => resolveThreeSecond({}));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByLabelText('user.userForm.disabled')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(managerPermissionSpy).toBeCalledTimes(1);
    expect(updateUserSpy).toBeCalledWith({
      email: 'user@123.com',
      user_name: 'admin',
      phone: '13312341234',
      management_permission_code_list: [1],
      user_group_name_list: [],
    });
  });

  test('should send update user request when user clear email', async () => {
    managerPermissionSpy.mockClear();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: { [ModalName.Update_User]: true },
          selectUser: {
            user_name: 'san.zhang',
            email: 'user@123.com',
            phone: '13312341234',
            management_permission_list: [
              {
                desc: '创建项目',
                code: 1,
              },
            ],
          },
        },
      })
    );
    render(<UpdateUser />);
    expect(managerPermissionSpy).toBeCalledTimes(1);

    const updateUserSpy = jest.spyOn(user, 'updateUserV1');
    updateUserSpy.mockImplementation(() => resolveThreeSecond({}));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByLabelText('user.userForm.username')).toHaveValue(
      'san.zhang'
    );

    fireEvent.input(screen.getByLabelText('user.userForm.email'), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(managerPermissionSpy).toBeCalledTimes(1);
    expect(updateUserSpy).toBeCalledWith({
      email: '',
      user_name: 'san.zhang',
      is_disabled: false,
      management_permission_code_list: [1],
      user_group_name_list: [],
      phone: '13312341234',
    });
  });
});
