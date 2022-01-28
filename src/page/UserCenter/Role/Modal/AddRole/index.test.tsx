import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import AddRole from '.';
import role from '../../../../../api/role';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';

describe('User/Modal/AddRole', () => {
  let instanceSpy: jest.SpyInstance;
  let usernameSpy: jest.SpyInstance;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    instanceSpy = mockUseInstance();
    usernameSpy = mockUseUsername();
    mockUseSelector({
      userManage: { modalStatus: { [ModalName.Add_Role]: true } },
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
    render(<AddRole />);
    expect(instanceSpy).toBeCalledTimes(1);
    expect(usernameSpy).toBeCalledTimes(1);
    cleanup();
    instanceSpy.mockClear();
    usernameSpy.mockClear();
    mockUseSelector({
      userManage: { modalStatus: { [ModalName.Add_Role]: false } },
    });
    render(<AddRole />);
    expect(instanceSpy).not.toBeCalled();
    expect(usernameSpy).not.toBeCalled();
  });

  test('should send create role request when user click submit button', async () => {
    render(<AddRole />);
    const createRoleSpy = jest.spyOn(role, 'createRoleV1');
    createRoleSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('user.roleForm.roleName'), {
      target: { value: 'role1' },
    });
    fireEvent.input(screen.getByLabelText('user.roleForm.roleDesc'), {
      target: { value: 'role1 desc' },
    });

    fireEvent.mouseDown(screen.getByLabelText('user.roleForm.databases'));
    const databaseOption = screen.getAllByText('instance1')[1];
    expect(databaseOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(databaseOption);

    fireEvent.mouseDown(screen.getByLabelText('user.roleForm.usernames'));
    const usernameOption = screen.getAllByText('user_name1')[1];
    expect(usernameOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(usernameOption);

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
    expect(createRoleSpy).toBeCalledTimes(1);
    expect(createRoleSpy).toBeCalledWith({
      instance_name_list: ['instance1'],
      role_desc: 'role1 desc',
      role_name: 'role1',
      user_name_list: ['user_name1'],
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('user.createRole.createSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).nthCalledWith(1, EmitterKey.Refresh_Role_list);
    expect(emitSpy).nthCalledWith(2, EmitterKey.Refresh_User_list);
    expect(screen.getByLabelText('user.roleForm.roleName')).toHaveValue('');
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'ADD_ROLE',
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
