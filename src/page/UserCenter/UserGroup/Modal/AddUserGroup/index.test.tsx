import { fireEvent, screen, waitFor } from '@testing-library/react';
import AddUserGroup from '.';
import user_group from '../../../../../api/user_group';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { selectOptionByIndex } from '../../../../../testUtils/customQuery';
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

describe('AddUserGroup', () => {
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseRole();
    mockUseUsername();
    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseSelector({
      userManage: {
        modalStatus: {
          [ModalName.Add_User_Group]: true,
        },
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockCreateUser = () => {
    const spy = jest.spyOn(user_group, 'CreateUserGroupV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  it('should match snapshot when visible is falsy', () => {
    mockUseSelector({
      userManage: {
        modalStatus: {
          [ModalName.Add_User_Group]: false,
        },
      },
    });
    const { baseElement } = renderWithRedux(<AddUserGroup />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when visible is truthy', () => {
    const { baseElement } = renderWithRedux(<AddUserGroup />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should close and reset form when user close modal', async () => {
    renderWithRedux(<AddUserGroup />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(
      screen.getByLabelText('userGroup.userGroupField.userGroupName'),
      {
        target: { value: 'test' },
      }
    );

    expect(
      screen.getByLabelText('userGroup.userGroupField.userGroupName')
    ).toHaveValue('test');

    fireEvent.click(screen.getByText('common.close'));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'ADD_USER_GROUP',
        status: false,
      },
      type: 'user/updateModalStatus',
    });

    expect(
      screen.getByLabelText('userGroup.userGroupField.userGroupName')
    ).toHaveValue('');
  });

  it('should create user group when user input all field and click submit button', async () => {
    const createUserSpy = mockCreateUser();
    renderWithRedux(<AddUserGroup />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(
      screen.getByLabelText('userGroup.userGroupField.userGroupName'),
      {
        target: { value: 'userGroupName1' },
      }
    );

    fireEvent.input(
      screen.getByLabelText('userGroup.userGroupField.userGroupDesc'),
      {
        target: { value: 'user group desc' },
      }
    );

    selectOptionByIndex('userGroup.userGroupField.roleNameList', 'role_name1');
    selectOptionByIndex('userGroup.userGroupField.userNameList', 'user_name1');

    fireEvent.click(screen.getByText('common.submit'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toBeDisabled();

    expect(createUserSpy).toBeCalledTimes(1);
    expect(createUserSpy).toBeCalledWith({
      role_name_list: ['role_name1'],
      user_group_desc: 'user group desc',
      user_group_name: 'userGroupName1',
      user_name_list: ['user_name1'],
    });
    const emitSpy = jest.spyOn(EventEmitter, 'emit');

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: 'ADD_USER_GROUP',
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
