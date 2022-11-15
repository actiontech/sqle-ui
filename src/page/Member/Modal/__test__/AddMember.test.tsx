import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseRole,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import AddMember from '../AddMember';
import { mockAddMember } from './utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
const projectName = 'test';

describe('test AddMember', () => {
  let addMemberSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  const emitSpy = jest.spyOn(EventEmitter, 'emit');

  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    mockUseRole();
    mockUseInstance();
    addMemberSpy = mockAddMember();
    useLocationMock.mockImplementation(() => {
      return { state: { projectName } };
    });
    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseSelector({
      member: {
        modalStatus: {
          [ModalName.Add_Member]: true,
        },
      },
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    useLocationMock.mockRestore();
  });

  test('should match snapshot', async () => {
    const { baseElement } = render(<AddMember />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should call add member request when clicking submit button', async () => {
    render(<AddMember />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(addMemberSpy).toBeCalledTimes(0);
    expect(dispatchSpy).toBeCalledTimes(0);
    expect(emitSpy).toBeCalledTimes(0);

    fireEvent.change(screen.getByLabelText('member.memberForm.username'), {
      target: { value: 'name' },
    });
    fireEvent.click(screen.getByLabelText('member.memberForm.projectAdmin'));
    selectOptionByIndex('member.roleSelector.role', 'role_name1');
    selectOptionByIndex('member.roleSelector.instance', 'instance1');

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.getByText('common.close').closest('button')).toBeDisabled();
    expect(screen.getByText('common.submit').closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    expect(addMemberSpy).toBeCalledTimes(1);
    expect(addMemberSpy).toBeCalledWith({
      project_name: projectName,
      roles: [{ instance_name: 'instance1', role_names: ['role_name1'] }],
      user_name: 'name',
      is_manager: true,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('member.addMember.successTips')
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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('member.addMember.successTips')
    ).not.toBeInTheDocument();
  });

  test('should clear form and dispatch "updateMemberModalStatus" when clicking close button', async () => {
    render(<AddMember />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(0);

    fireEvent.change(screen.getByLabelText('member.memberForm.username'), {
      target: { value: 'name' },
    });

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
});
