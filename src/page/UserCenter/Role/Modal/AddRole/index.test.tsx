import {
  cleanup,
  fireEvent,
  render,
  act,
  screen,
} from '@testing-library/react';
import AddRole from '.';
import role from '../../../../../api/role';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';

import {
  mockUseOperation,
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

describe('User/Modal/AddRole', () => {
  let useOperation: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    useOperation = mockUseOperation();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: { modalStatus: { [ModalName.Add_Role]: true } },
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

  test('should get instance list and username list when modal is opened', async () => {
    render(<AddRole />);
    expect(useOperation).toBeCalledTimes(1);
    cleanup();

    useOperation.mockClear();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: { modalStatus: { [ModalName.Add_Role]: false } },
      })
    );
    render(<AddRole />);

    expect(useOperation).not.toBeCalled();
  });

  test('should send create role request when user click submit button', async () => {
    render(<AddRole />);
    const createRoleSpy = jest.spyOn(role, 'createRoleV1');
    createRoleSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('role.roleForm.roleName'), {
      target: { value: 'role1' },
    });
    fireEvent.input(screen.getByLabelText('role.roleForm.roleDesc'), {
      target: { value: 'role1 desc' },
    });

    fireEvent.mouseDown(screen.getByLabelText('role.roleForm.operationCodes'));
    const operationCodesOption = screen.getAllByText('查看工单')[0];
    expect(operationCodesOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(operationCodesOption);

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toHaveAttribute(
      'disabled'
    );
    expect(createRoleSpy).toBeCalledTimes(1);
    expect(createRoleSpy).toBeCalledWith({
      role_desc: 'role1 desc',
      role_name: 'role1',
      operation_code_list: [20100],
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('role.createRole.createSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Role_list);
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
