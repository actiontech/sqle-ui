import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import AddUser from '.';
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
      userManage: { modalStatus: { [ModalName.Add_User]: true } },
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
    render(<AddUser />);
    expect(userRoleSpy).toBeCalledTimes(1);
    cleanup();
    userRoleSpy.mockClear();
    mockUseSelector({
      userManage: { modalStatus: { [ModalName.Add_User]: false } },
    });
    render(<AddUser />);
    expect(userRoleSpy).not.toBeCalled();
  });

  test('should send create role request when user click submit button', async () => {
    render(<AddUser />);
    const createUserSpy = jest.spyOn(user, 'createUserV1');
    createUserSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('user.userForm.username'), {
      target: { value: 'username1' },
    });
    fireEvent.input(screen.getByLabelText('user.userForm.password'), {
      target: { value: '123456' },
    });

    fireEvent.input(screen.getByLabelText('user.userForm.passwordConfirm'), {
      target: { value: '123456' },
    });

    fireEvent.input(screen.getByLabelText('user.userForm.email'), {
      target: { value: 'user@163.com' },
    });

    fireEvent.mouseDown(screen.getByLabelText('user.userForm.role'));
    const roleOption = screen.getAllByText('role_name1')[1];
    expect(roleOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(roleOption);

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
    expect(createUserSpy).toBeCalledTimes(1);
    expect(createUserSpy).toBeCalledWith({
      email: 'user@163.com',
      user_name: 'username1',
      user_password: '123456',
      role_name_list: ['role_name1'],
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('user.createUser.createSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).nthCalledWith(1, EmitterKey.Refresh_Role_list);
    expect(emitSpy).nthCalledWith(2, EmitterKey.Refresh_User_list);
    expect(screen.getByLabelText('user.userForm.username')).toHaveValue('');
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'ADD_USER',
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
});
