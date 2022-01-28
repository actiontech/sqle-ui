import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import RoleList from '.';
import role from '../../../../api/role';
import EmitterKey from '../../../../data/EmitterKey';
import { getBySelector } from '../../../../testUtils/customQuery';
import { mockUseDispatch } from '../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseRole,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import { RoleListData } from './__testData__';

describe('User/RoleList', () => {
  let dispatchMock: jest.Mock;
  let getRoleListSpy: jest.SpyInstance;

  beforeEach(() => {
    const { scopeDispatch } = mockUseDispatch();
    dispatchMock = scopeDispatch;
    jest.useFakeTimers();
    mockUseUsername();
    mockUseRole();
    mockUseInstance();
    getRoleListSpy = mockGetRoleList();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const mockGetRoleList = () => {
    const spy = jest.spyOn(role, 'getRoleListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(RoleListData, { otherData: { total_nums: 11 } })
    );
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = render(<RoleList />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should get role list by default page size and page index', async () => {
    render(<RoleList />);
    expect(getRoleListSpy).toBeCalledTimes(1);
    expect(getRoleListSpy).toBeCalledWith({ page_index: 1, page_size: 10 });
  });

  test('should jump to next page when user click next page button', async () => {
    render(<RoleList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(getBySelector('.ant-pagination-next'));
    expect(getRoleListSpy).toBeCalledWith({
      page_index: 2,
      page_size: 10,
    });
    fireEvent.click(getBySelector('.ant-pagination-prev'));
    expect(getRoleListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
  });

  test('should filter table data when user input filter data and click search button', async () => {
    render(<RoleList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.mouseDown(screen.getByLabelText('user.roleForm.usernames'));
    const option = screen.getAllByText('user_name1')[1];
    expect(option).toHaveClass('ant-select-item-option-content');
    fireEvent.click(option);

    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(getRoleListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      filter_user_name: 'user_name1',
    });
  });

  test('should dispatch open create role modal event when user click creat role button', async () => {
    render(<RoleList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('user.createRole.button'));
    expect(dispatchMock).toBeCalledTimes(1);
    expect(dispatchMock).toBeCalledWith({
      payload: {
        modalName: 'ADD_ROLE',
        status: true,
      },
      type: 'user/updateModalStatus',
    });
  });

  test('should dispatch open create role modal event and set select role data when user click update role button', async () => {
    render(<RoleList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getAllByText('common.edit')[0]);
    expect(dispatchMock).toBeCalledTimes(2);
    expect(dispatchMock).nthCalledWith(1, {
      payload: {
        role: RoleListData[0],
      },
      type: 'user/updateSelectRole',
    });
    expect(dispatchMock).nthCalledWith(2, {
      payload: {
        modalName: 'UPDATE_ROLE',
        status: true,
      },
      type: 'user/updateModalStatus',
    });
  });

  test('should send delete role when user confirm delete user', async () => {
    const deleteRoleSpy = jest.spyOn(role, 'deleteRoleV1');
    deleteRoleSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    render(<RoleList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getRoleListSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getAllByText('common.delete')[0]);
    expect(
      screen.queryByText('user.deleteRole.deleteTips')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.ok'));

    expect(deleteRoleSpy).toBeCalledTimes(1);
    expect(deleteRoleSpy).toBeCalledWith({
      role_name: RoleListData[0].role_name,
    });
    expect(screen.getByText('user.deleteRole.deleting')).toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('user.deleteRole.deleting')).toBeInTheDocument();
    expect(
      screen.getByText('user.deleteRole.deleteSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_User_list);

    expect(getRoleListSpy).toBeCalledTimes(2);
    expect(getRoleListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    expect(
      screen.queryByText('user.deleteRole.deleting')
    ).not.toBeInTheDocument();
    emitSpy.mockRestore();
  });

  test('should refresh table data when receive "Refresh_Role_list" event', async () => {
    render(<RoleList />);
    expect(getRoleListSpy).toBeCalledTimes(1);
    expect(getRoleListSpy).nthCalledWith(1, {
      page_index: 1,
      page_size: 10,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Role_list);
    });
    expect(getRoleListSpy).toBeCalledTimes(2);
    expect(getRoleListSpy).nthCalledWith(2, {
      page_index: 1,
      page_size: 10,
    });
  });
});
