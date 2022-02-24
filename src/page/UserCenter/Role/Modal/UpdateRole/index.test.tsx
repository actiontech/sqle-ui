import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import UpdateRole from '.';
import role from '../../../../../api/role';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { getSelectContentByFormLabel } from '../../../../../testUtils/customQuery';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseOperation,
  mockUseUserGroup,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';

describe('User/Modal/AddRole', () => {
  let instanceSpy: jest.SpyInstance;
  let usernameSpy: jest.SpyInstance;
  let userGroupSpy: jest.SpyInstance;
  let useOperationSpy: jest.SpyInstance;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    instanceSpy = mockUseInstance();
    usernameSpy = mockUseUsername();
    userGroupSpy = mockUseUserGroup();
    useOperationSpy = mockUseOperation();
    mockUseSelector({
      userManage: {
        modalStatus: { [ModalName.Update_Role]: true },
        selectRole: {
          role_name: 'oldName',
          role_desc: 'oldDesc',
          user_name_list: ['user_name1'],
          instance_name_list: ['instance1'],
          user_group_name_list: ['user_group1'],
          operation_list: [{ op_code: 20100 }],
          is_disabled: false,
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
    expect(userGroupSpy).toBeCalledTimes(1);
    expect(useOperationSpy).toBeCalledTimes(1);
    cleanup();
    instanceSpy.mockClear();
    usernameSpy.mockClear();
    userGroupSpy.mockClear();
    useOperationSpy.mockClear();
    mockUseSelector({
      userManage: { modalStatus: { [ModalName.Add_Role]: false } },
    });
    render(<UpdateRole />);
    expect(instanceSpy).not.toBeCalled();
    expect(usernameSpy).not.toBeCalled();
    expect(userGroupSpy).not.toBeCalled();
    expect(useOperationSpy).not.toBeCalled();
  });

  test('should send update role request when user click submit button', async () => {
    render(<UpdateRole />);
    const updateRoleSpy = jest.spyOn(role, 'updateRoleV2');
    updateRoleSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByLabelText('role.roleForm.roleName')).toHaveAttribute(
      'disabled'
    );
    expect(screen.getByLabelText('role.roleForm.roleName')).toHaveValue(
      'oldName'
    );

    expect(screen.getByLabelText('role.roleForm.roleDesc')).toHaveValue(
      'oldDesc'
    );

    fireEvent.input(screen.getByLabelText('role.roleForm.roleDesc'), {
      target: { value: 'role1 desc' },
    });

    const instanceSelect = getSelectContentByFormLabel(
      'role.roleForm.databases'
    );
    expect(instanceSelect).toBeInTheDocument();
    expect(instanceSelect).toHaveTextContent('instance1');

    const userSelect = getSelectContentByFormLabel('role.roleForm.usernames');
    expect(userSelect).toBeInTheDocument();
    expect(userSelect).toHaveTextContent('user_name1');

    const userGroupSelect = getSelectContentByFormLabel(
      'role.roleForm.userGroups'
    );
    expect(userGroupSelect).toBeInTheDocument();
    expect(userGroupSelect).toHaveTextContent('user_group1');

    const operationCodeSelect = getSelectContentByFormLabel(
      'role.roleForm.operationCodes'
    );
    expect(operationCodeSelect).toBeInTheDocument();
    expect(operationCodeSelect).toHaveTextContent('查看工单');

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
    expect(updateRoleSpy).toBeCalledTimes(1);
    expect(updateRoleSpy).toBeCalledWith({
      instance_name_list: ['instance1'],
      role_desc: 'role1 desc',
      role_name: 'oldName',
      user_name_list: ['user_name1'],
      user_group_name_list: ['user_group1'],
      operation_code_list: [20100],
      is_disabled: false,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('role.updateRole.updateSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Role_list);
    expect(screen.getByLabelText('role.roleForm.roleName')).toHaveValue('');
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
