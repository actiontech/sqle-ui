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
  mockUseOperation,
  resolveThreeSecond,
} from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';

describe('User/Modal/AddRole', () => {
  let useOperationSpy: jest.SpyInstance;
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    useOperationSpy = mockUseOperation();
    mockUseSelector({
      userManage: {
        modalStatus: { [ModalName.Update_Role]: true },
        selectRole: {
          role_name: 'oldName',
          role_desc: 'oldDesc',
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
    expect(useOperationSpy).toBeCalledTimes(1);
    cleanup();
    useOperationSpy.mockClear();
    mockUseSelector({
      userManage: { modalStatus: { [ModalName.Add_Role]: false } },
    });
    render(<UpdateRole />);
    expect(useOperationSpy).not.toBeCalled();
  });

  test('should send update role request when user click submit button', async () => {
    render(<UpdateRole />);
    const updateRoleSpy = jest.spyOn(role, 'updateRoleV1');
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
      role_desc: 'role1 desc',
      role_name: 'oldName',
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
