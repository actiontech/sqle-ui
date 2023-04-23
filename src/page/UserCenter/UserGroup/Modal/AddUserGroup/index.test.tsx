import { act, fireEvent, screen } from '@testing-library/react';
import AddUserGroup from '.';
import user_group from '../../../../../api/user_group';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { selectOptionByIndex } from '../../../../../testUtils/customQuery';
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

describe('AddUserGroup', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseRole();
    mockUseUsername();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: {
            [ModalName.Add_User_Group]: true,
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

  const mockCreateUser = () => {
    const spy = jest.spyOn(user_group, 'CreateUserGroupV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  it('should match snapshot when visible is falsy', () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: {
            [ModalName.Add_User_Group]: false,
          },
        },
      })
    );
    const { baseElement } = renderWithRedux(<AddUserGroup />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when visible is truthy', () => {
    const { baseElement } = renderWithRedux(<AddUserGroup />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should close and reset form when user close modal', async () => {
    renderWithRedux(<AddUserGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

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
    await act(async () => jest.advanceTimersByTime(0));

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
    await act(async () => jest.advanceTimersByTime(3000));

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

    selectOptionByIndex('userGroup.userGroupField.userNameList', 'user_name1');

    fireEvent.click(screen.getByText('common.submit'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toBeDisabled();

    expect(createUserSpy).toBeCalledTimes(1);
    expect(createUserSpy).toBeCalledWith({
      user_group_desc: 'user group desc',
      user_group_name: 'userGroupName1',
      user_name_list: ['user_name1'],
    });
    const emitSpy = jest.spyOn(EventEmitter, 'emit');

    await act(async () => jest.advanceTimersByTime(3000));

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
    expect(
      screen.getByText('userGroup.createUserGroup.successTips')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('userGroup.createUserGroup.successTips')
    ).not.toBeInTheDocument();
  });

  it('should reset submit button state when create request throw error', async () => {
    const createUserSpy = mockCreateUser();
    createUserSpy.mockImplementation(() => resolveErrorThreeSecond({}));
    renderWithRedux(<AddUserGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(
      screen.getByLabelText('userGroup.userGroupField.userGroupName'),
      {
        target: { value: 'userGroupName1' },
      }
    );
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
