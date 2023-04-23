import { fireEvent, screen, act } from '@testing-library/react';
import UpdateUserGroup from '.';
import user_group from '../../../../../api/user_group';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { renderWithRedux } from '../../../../../testUtils/customRender';
import {
  mockUseRole,
  mockUseUsername,
  resolveErrorThreeSecond,
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

describe('updateUserGroup', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseRole();
    mockUseUsername();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
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
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
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
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: {
            [ModalName.Update_User_Group]: false,
          },
        },
      })
    );
    const { baseElement } = renderWithRedux(<UpdateUserGroup />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when visible is truthy', async () => {
    const { baseElement } = renderWithRedux(<UpdateUserGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
  });

  it('should close modal and reset form when user click cancel button', async () => {
    renderWithRedux(<UpdateUserGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.close'));
    await act(async () => jest.advanceTimersByTime(0));

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
    await act(async () => jest.advanceTimersByTime(0));

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

    await act(async () => jest.advanceTimersByTime(0));

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      is_disabled: false,
      user_group_desc: 'user group desc2',
      user_group_name: 'userGroupName1',
      user_name_list: ['user_name1'],
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));

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
    expect(
      screen.getByText('userGroup.updateUserGroup.successTips')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('userGroup.updateUserGroup.successTips')
    ).not.toBeInTheDocument();
  });

  it('should reset submit button state when create request throw error', async () => {
    const updateSpy = mockUpdateUserGroup();
    updateSpy.mockImplementation(() => resolveErrorThreeSecond({}));
    renderWithRedux(<UpdateUserGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).not.toBeDisabled();
  });
});
