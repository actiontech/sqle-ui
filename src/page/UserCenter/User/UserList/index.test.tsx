import { fireEvent, render, screen, act } from '@testing-library/react';
import UserList from '.';
import user from '../../../../api/user';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { getBySelector } from '../../../../testUtils/customQuery';
import {
  mockUseUsername,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import { UserListData } from './__testData__';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});
describe('User/UserList', () => {
  const dispatchMock = jest.fn();

  let getUserListSpy: jest.SpyInstance;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchMock);

    jest.useFakeTimers();
    mockUseUsername();
    getUserListSpy = mockGetUserList();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const mockGetUserList = () => {
    const spy = jest.spyOn(user, 'getUserListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(UserListData, { otherData: { total_nums: 11 } })
    );
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = render(<UserList />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should get user list by default page size and page index', async () => {
    render(<UserList />);
    expect(getUserListSpy).toBeCalledTimes(1);
    expect(getUserListSpy).toBeCalledWith({ page_index: 1, page_size: 10 });
  });

  test('should jump to next page when user click next page button', async () => {
    render(<UserList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.ant-pagination-next'));
    expect(getUserListSpy).toBeCalledWith({
      page_index: 2,
      page_size: 10,
    });
    fireEvent.click(getBySelector('.ant-pagination-prev'));
    expect(getUserListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
  });

  test('should filter table data when user input filter data and click search button', async () => {
    render(<UserList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('user.userForm.username'));
    const option = screen.getAllByText('user_name1')[1];
    expect(option).toHaveClass('ant-select-item-option-content');
    fireEvent.click(option);

    fireEvent.click(screen.getByText('common.search'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getUserListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      filter_user_name: 'user_name1',
    });
  });

  test('should dispatch open create user modal event when user click creat user button', async () => {
    render(<UserList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('user.createUser.button'));
    expect(dispatchMock).toBeCalledTimes(1);
    expect(dispatchMock).toBeCalledWith({
      payload: {
        modalName: 'ADD_USER',
        status: true,
      },
      type: 'user/updateModalStatus',
    });
  });

  test('should dispatch open create user modal event and set select user data when user click update user button', async () => {
    render(<UserList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('common.edit')[0]);
    expect(dispatchMock).toBeCalledTimes(2);
    expect(dispatchMock).nthCalledWith(1, {
      payload: {
        user: UserListData[0],
      },
      type: 'user/updateSelectUser',
    });
    expect(dispatchMock).nthCalledWith(2, {
      payload: {
        modalName: 'Update_User',
        status: true,
      },
      type: 'user/updateModalStatus',
    });
  });

  test('should dispatch open modify password modal event and set select user data when user click update user password button', async () => {
    render(<UserList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseEnter(screen.getAllByText('common.more')[0]);
    await screen.findByText('user.updateUserPassword.button');
    fireEvent.click(screen.getByText('user.updateUserPassword.button'));
    expect(dispatchMock).toBeCalledTimes(2);
    expect(dispatchMock).nthCalledWith(1, {
      payload: {
        user: UserListData[2],
      },
      type: 'user/updateSelectUser',
    });
    expect(dispatchMock).nthCalledWith(2, {
      payload: {
        modalName: ModalName.Update_User_Password,
        status: true,
      },
      type: 'user/updateModalStatus',
    });
  });

  test('should send delete user when user confirm delete user', async () => {
    const deleteUserSpy = jest.spyOn(user, 'deleteUserV1');
    deleteUserSpy.mockImplementation(() => resolveThreeSecond({}));
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    render(<UserList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getUserListSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getAllByText('common.delete')[0]);
    expect(
      screen.getByText('user.deleteUser.confirmTitle')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.ok'));

    expect(deleteUserSpy).toBeCalledTimes(1);
    expect(deleteUserSpy).toBeCalledWith({
      user_name: UserListData[1].user_name,
    });
    expect(screen.getByText('user.deleteUser.deleting')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('user.deleteUser.deleting')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('user.deleteUser.deleteSuccess')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).nthCalledWith(1, EmitterKey.Refresh_Role_list);
    expect(emitSpy).nthCalledWith(2, EmitterKey.Refresh_User_Group_List);

    expect(getUserListSpy).toBeCalledTimes(2);
    expect(getUserListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
  });

  test('should refresh table data when receive "Refresh_User_list" event', async () => {
    render(<UserList />);
    expect(getUserListSpy).toBeCalledTimes(1);
    expect(getUserListSpy).nthCalledWith(1, {
      page_index: 1,
      page_size: 10,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_User_list);
    });
    expect(getUserListSpy).toBeCalledTimes(2);
    expect(getUserListSpy).nthCalledWith(2, {
      page_index: 1,
      page_size: 10,
    });
  });

  test('should not be rendered delete and more when the username is admin and do not render more when user login type is ldap', async () => {
    render(<UserList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getAllByText('common.more').length).toBe(4);
    expect(screen.getAllByText('common.delete').length).toBe(9);
  });
});
