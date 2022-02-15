import { fireEvent, screen, waitFor } from '@testing-library/react';
import UserGroupList from '.';
import user_group from '../../../../api/user_group';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import { renderWithRedux } from '../../../../testUtils/customRender';
import { mockUseDispatch } from '../../../../testUtils/mockRedux';
import {
  mockUseUserGroup,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { userGroupList } from './__testData__';

describe('UserGroupList', () => {
  let dispatchSpy: jest.SpyInstance;
  let getUserGroupListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    dispatchSpy = mockUseDispatch().scopeDispatch;
    getUserGroupListSpy = mockGetUserGroupList();
    mockUseUserGroup();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetUserGroupList = () => {
    const spy = jest.spyOn(user_group, 'getUserGroupListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(userGroupList, {
        otherData: {
          total_nums: 62,
        },
      })
    );
    return spy;
  };

  const mockDeleteUserGroup = () => {
    const spy = jest.spyOn(user_group, 'deleteUserGroupV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  it('should match snapshot', async () => {
    const { container } = renderWithRedux(<UserGroupList />);
    expect(container).toMatchSnapshot();
    expect(getUserGroupListSpy).toBeCalledTimes(1);
    expect(getUserGroupListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
    expect(getUserGroupListSpy).toBeCalledTimes(1);
  });

  it('should filter user group name when user select table filter info', async () => {
    renderWithRedux(<UserGroupList />);
    expect(getUserGroupListSpy).toBeCalledTimes(1);
    expect(getUserGroupListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    selectOptionByIndex(
      'userGroup.userGroupField.userGroupName',
      'user_group_name1'
    );
    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(getUserGroupListSpy).toBeCalledTimes(2);
    expect(getUserGroupListSpy).nthCalledWith(2, {
      page_index: 1,
      page_size: 10,
      filter_user_group_name: 'user_group_name1',
    });
    fireEvent.click(screen.getByText('common.reset'));
    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(getUserGroupListSpy).toBeCalledTimes(3);
    expect(getUserGroupListSpy).nthCalledWith(3, {
      page_index: 1,
      page_size: 10,
    });
  });

  it('should update addUserGroup modal status when user click create user group button', async () => {
    renderWithRedux(<UserGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('userGroup.createUserGroup.title'));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'ADD_USER_GROUP',
        status: true,
      },
      type: 'user/updateModalStatus',
    });
  });

  it('should update updateUserGroup modal status when user click editor user group button', async () => {
    renderWithRedux(<UserGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getAllByText('common.edit')[0]);
    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).nthCalledWith(1, {
      payload: {
        userGroup: userGroupList[0],
      },
      type: 'user/updateSelectUserGroup',
    });

    expect(dispatchSpy).nthCalledWith(2, {
      payload: {
        modalName: 'Update_User_Group',
        status: true,
      },
      type: 'user/updateModalStatus',
    });
  });

  it('should delete a user group when user click delete user group', async () => {
    const deleteSpy = mockDeleteUserGroup();
    const { baseElement } = renderWithRedux(<UserGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getUserGroupListSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getAllByText('common.delete')[0]);
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.ok'));
    fireEvent.click(screen.getByText('common.ok'));
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({
      user_group_name: userGroupList[0].user_group_name,
    });
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(baseElement).toMatchSnapshot();
    expect(getUserGroupListSpy).toBeCalledTimes(2);
  });

  it('should refresh table list when user click refresh button', async () => {
    renderWithRedux(<UserGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getUserGroupListSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getByTestId('refresh-button'));
    expect(getUserGroupListSpy).toBeCalledTimes(2);
  });
});
