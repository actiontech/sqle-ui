import { act, fireEvent, render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';

import {
  mockUseInstance,
  mockUseRole,
  mockUseUserGroup,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import AddMemberGroup from '../AddMemberGroup';
import { mockAddMemberGroup } from './utils';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});
const projectName = 'default';

describe('test AddMemberGroup', () => {
  let addMemberGroupSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const emitSpy = jest.spyOn(EventEmitter, 'emit');

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    mockUseRole();
    mockUseUserGroup();
    mockUseInstance();
    addMemberGroupSpy = mockAddMemberGroup();
    useParamsMock.mockReturnValue({ projectName });

    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: {
            [ModalName.Add_Member_Group]: true,
          },
        },
      })
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { baseElement } = render(<AddMemberGroup />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should call add member group request when clicking submit button', async () => {
    render(<AddMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(addMemberGroupSpy).toBeCalledTimes(0);
    expect(dispatchSpy).toBeCalledTimes(0);
    expect(emitSpy).toBeCalledTimes(0);

    selectOptionByIndex(
      'member.memberGroupForm.userGroupName',
      'user_group_name1'
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('member.roleSelector.addRole'));
    selectOptionByIndex('member.roleSelector.role', 'role_name1');
    selectOptionByIndex('member.roleSelector.instance', 'instance1');

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('common.close').closest('button')).toBeDisabled();
    expect(screen.getByText('common.submit').closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    expect(addMemberGroupSpy).toBeCalledTimes(1);
    expect(addMemberGroupSpy).toBeCalledWith({
      project_name: projectName,
      roles: [{ instance_name: 'instance1', role_names: ['role_name1'] }],
      user_group_name: 'user_group_name1',
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('member.addMemberGroup.successTips')
    ).toBeInTheDocument();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Member_Group,
        status: false,
      },
    });
    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Member_Group_List);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Filter_User_Group_Tips);
    expect(
      screen.getByText('common.close').closest('button')
    ).not.toBeDisabled();
    expect(screen.getByText('common.submit').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('member.addMemberGroup.successTips')
    ).not.toBeInTheDocument();
  });

  test('should clear form and dispatch "updateMemberModalStatus" when clicking close button', async () => {
    render(<AddMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dispatchSpy).toBeCalledTimes(0);

    selectOptionByIndex(
      'member.memberGroupForm.userGroupName',
      'user_group_name1'
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('common.close'));

    expect(
      screen.getByLabelText('member.memberGroupForm.userGroupName')
    ).toHaveValue('');

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Member_Group,
        status: false,
      },
    });
  });
});
