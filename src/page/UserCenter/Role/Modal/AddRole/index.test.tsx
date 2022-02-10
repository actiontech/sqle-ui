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
  mockUseOperation,
  mockUseUserGroup,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';

describe('User/Modal/AddRole', () => {
  let instanceSpy: jest.SpyInstance;
  let usernameSpy: jest.SpyInstance;
  let useUserGroupSpy: jest.SpyInstance;
  let useOperation: jest.SpyInstance;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    instanceSpy = mockUseInstance();
    usernameSpy = mockUseUsername();
    useUserGroupSpy = mockUseUserGroup();
    useOperation = mockUseOperation();

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
    expect(useUserGroupSpy).toBeCalledTimes(1);
    expect(useOperation).toBeCalledTimes(1);
    cleanup();
    instanceSpy.mockClear();
    usernameSpy.mockClear();
    useUserGroupSpy.mockClear();
    useOperation.mockClear();
    mockUseSelector({
      userManage: { modalStatus: { [ModalName.Add_Role]: false } },
    });
    render(<AddRole />);
    expect(instanceSpy).not.toBeCalled();
    expect(usernameSpy).not.toBeCalled();
    expect(useUserGroupSpy).not.toBeCalled();
    expect(useOperation).not.toBeCalled();
  });

  test('should send create role request when user click submit button', async () => {
    render(<AddRole />);
    const createRoleSpy = jest.spyOn(role, 'createRoleV2');
    createRoleSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('role.roleForm.roleName'), {
      target: { value: 'role1' },
    });
    fireEvent.input(screen.getByLabelText('role.roleForm.roleDesc'), {
      target: { value: 'role1 desc' },
    });

    fireEvent.mouseDown(screen.getByLabelText('role.roleForm.databases'));
    const databaseOption = screen.getAllByText('instance1')[1];
    expect(databaseOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(databaseOption);

    fireEvent.mouseDown(screen.getByLabelText('role.roleForm.usernames'));
    const usernameOption = screen.getAllByText('user_name1')[1];
    expect(usernameOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(usernameOption);

    fireEvent.mouseDown(screen.getByLabelText('role.roleForm.operationCodes'));
    const operationCodesOption = screen.getAllByText('查看工单')[0];
    expect(operationCodesOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(operationCodesOption);

    fireEvent.mouseDown(screen.getByLabelText('role.roleForm.userGroups'));
    const userGroupsOption = screen.getAllByText('user_group_name1')[1];
    expect(userGroupsOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(userGroupsOption);

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
      operation_code_list: ['20100'],
      user_group_name_list: ['user_group_name1'],
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('role.createRole.createSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).nthCalledWith(1, EmitterKey.Refresh_Role_list);
    expect(emitSpy).nthCalledWith(2, EmitterKey.Refresh_User_list);
    expect(screen.getByLabelText('role.roleForm.roleName')).toHaveValue('');
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
