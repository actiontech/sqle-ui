import { act, fireEvent, render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';

import {
  mockUseInstance,
  mockUseRole,
  mockUseUsername,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import AddMember from '../AddMember';
import { mockAddMember } from './utils';
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

describe('test AddMember', () => {
  let addMemberSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const emitSpy = jest.spyOn(EventEmitter, 'emit');
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    mockUseRole();
    mockUseUsername();
    mockUseInstance();
    addMemberSpy = mockAddMember();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: {
            [ModalName.Add_Member]: true,
          },
        },
      })
    );

    useParamsMock.mockReturnValue({ projectName });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { baseElement } = render(<AddMember />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should call add member request when clicking submit button', async () => {
    render(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(addMemberSpy).toBeCalledTimes(0);
    expect(dispatchSpy).toBeCalledTimes(0);
    expect(emitSpy).toBeCalledTimes(0);

    selectOptionByIndex('member.memberForm.username', 'user_name1');
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

    expect(addMemberSpy).toBeCalledTimes(1);
    expect(addMemberSpy).toBeCalledWith({
      project_name: projectName,
      roles: [{ instance_name: 'instance1', role_names: ['role_name1'] }],
      user_name: 'user_name1',
      is_manager: false,
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('member.addMember.successTips')
    ).toBeInTheDocument();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Member,
        status: false,
      },
    });
    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Member_List);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Filter_User_Tips);
    expect(
      screen.getByText('common.close').closest('button')
    ).not.toBeDisabled();
    expect(screen.getByText('common.submit').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('member.addMember.successTips')
    ).not.toBeInTheDocument();
  });

  test('should clear form and dispatch "updateMemberModalStatus" when clicking close button', async () => {
    render(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dispatchSpy).toBeCalledTimes(0);

    selectOptionByIndex('member.memberForm.username', 'user_name1');
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('common.close'));

    expect(screen.getByLabelText('member.memberForm.username')).toHaveValue('');

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Member,
        status: false,
      },
    });
  });

  test('should pass empty roles data when selecting current member as project admin', async () => {
    render(<AddMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('member.memberForm.username', 'user_name1');
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('member.roleSelector.addRole'));
    selectOptionByIndex('member.roleSelector.role', 'role_name1');
    selectOptionByIndex('member.roleSelector.instance', 'instance1');

    fireEvent.click(screen.getByLabelText('member.memberForm.projectAdmin'));

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(addMemberSpy).toBeCalledTimes(1);
    expect(addMemberSpy).toBeCalledWith({
      project_name: projectName,
      roles: [],
      user_name: 'user_name1',
      is_manager: true,
    });

    await act(async () => jest.advanceTimersByTime(3000));
  });
});
