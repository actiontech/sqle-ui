import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import UpdateRole from '.';
import role from '../../../../api/role';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { getBySelector } from '../../../../testUtils/customQuery';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';

describe('User/Modal/AddRole', () => {
  let instanceSpy: jest.SpyInstance;
  let usernameSpy: jest.SpyInstance;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    instanceSpy = mockUseInstance();
    usernameSpy = mockUseUsername();
    mockUseSelector({
      userManage: {
        modalStatus: { [ModalName.Update_Role]: true },
        selectRole: {
          role_name: 'oldName',
          role_desc: 'oldDesc',
          user_name_list: ['user_name1'],
          instance_name_list: ['instance1'],
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
    render(<UpdateRole />);
    expect(instanceSpy).toBeCalledTimes(1);
    expect(usernameSpy).toBeCalledTimes(1);
    cleanup();
    instanceSpy.mockClear();
    usernameSpy.mockClear();
    mockUseSelector({
      userManage: { modalStatus: { [ModalName.Add_Role]: false } },
    });
    render(<UpdateRole />);
    expect(instanceSpy).not.toBeCalled();
    expect(usernameSpy).not.toBeCalled();
  });

  test('should send create role request when user click submit button', async () => {
    render(<UpdateRole />);
    const createRoleSpy = jest.spyOn(role, 'updateRoleV1');
    createRoleSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByLabelText('user.roleForm.roleName')).toHaveAttribute(
      'disabled'
    );
    expect(screen.getByLabelText('user.roleForm.roleName')).toHaveValue(
      'oldName'
    );

    expect(screen.getByLabelText('user.roleForm.roleDesc')).toHaveValue(
      'oldDesc'
    );

    fireEvent.input(screen.getByLabelText('user.roleForm.roleDesc'), {
      target: { value: 'role1 desc' },
    });

    const instanceSelect = getBySelector(
      '.ant-select-selection-item-content',
      screen.getByText('user.roleForm.databases').parentNode
        ?.parentNode as HTMLDivElement
    );
    expect(instanceSelect).toBeInTheDocument();
    expect(instanceSelect).toHaveTextContent('instance1');

    const userSelect = getBySelector(
      '.ant-select-selection-item-content',
      screen.getByText('user.roleForm.usernames').parentNode
        ?.parentNode as HTMLDivElement
    );
    expect(userSelect).toBeInTheDocument();
    expect(userSelect).toHaveTextContent('user_name1');

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
      role_name: 'oldName',
      user_name_list: ['user_name1'],
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('user.updateRole.updateSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).nthCalledWith(1, EmitterKey.Refresh_Role_list);
    expect(emitSpy).nthCalledWith(2, EmitterKey.Refresh_User_list);
    expect(screen.getByLabelText('user.roleForm.roleName')).toHaveValue('');
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'UPDATE_ROLE',
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
