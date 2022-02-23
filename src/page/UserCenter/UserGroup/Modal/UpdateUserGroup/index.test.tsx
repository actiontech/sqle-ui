import { fireEvent, screen, waitFor } from '@testing-library/react';
import UpdateUserGroup from '.';
import user_group from '../../../../../api/user_group';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { renderWithRedux } from '../../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import {
  mockUseRole,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';

describe('updateUserGroup', () => {
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseRole();
    mockUseUsername();
    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseSelector({
      userManage: {
        modalStatus: {
          [ModalName.Update_User_Group]: true,
        },
        selectUserGroup: {
          is_disabled: true,
          role_name_list: ['role_name1'],
          user_group_desc: 'user group desc',
          user_group_name: 'userGroupName1',
          user_name_list: ['user_name1'],
        },
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockUpdateUserGroup = () => {
    const spy = jest.spyOn(user_group, 'updateUserGroupV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  it('should match snapshot when visible is falsy', () => {
    mockUseSelector({
      userManage: {
        modalStatus: {
          [ModalName.Update_User_Group]: false,
        },
      },
    });
    const { baseElement } = renderWithRedux(<UpdateUserGroup />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when visible is truthy', async () => {
    const { baseElement } = renderWithRedux(<UpdateUserGroup />);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('should close modal and reset form when user click cancel button', async () => {
    renderWithRedux(<UpdateUserGroup />);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.close'));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'Update_User_Group',
        status: false,
      },
      type: 'user/updateModalStatus',
    });

    expect(
      screen.getByLabelText('userGroup.userGroupField.userGroupName')
    ).toHaveValue('');
  });

  it('should update user group when user input all field and click submit button', async () => {
    renderWithRedux(<UpdateUserGroup />);
    const updateSpy = mockUpdateUserGroup();
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.input(
      screen.getByLabelText('userGroup.userGroupField.userGroupDesc'),
      {
        target: { value: 'user group desc2' },
      }
    );
    fireEvent.click(
      screen.getByLabelText('userGroup.userGroupField.isDisabled')
    );
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    fireEvent.click(screen.getByText('common.submit'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      is_disabled: false,
      role_name_list: ['role_name1'],
      user_group_desc: 'user group desc2',
      user_group_name: 'userGroupName1',
      user_name_list: ['user_name1'],
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toBeDisabled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'Update_User_Group',
        status: false,
      },
      type: 'user/updateModalStatus',
    });
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_User_Group_List);

    expect(
      screen.getByLabelText('userGroup.userGroupField.userGroupName')
    ).toHaveValue('');
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).not.toBeDisabled();
  });
});
