import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseRole,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockMemberList } from '../../MemberList/__test__/utils';
import UpdateMember from '../UpdateMember';
import { mockUpdateMember } from './utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
const projectName = 'test';

describe('test UpdateMember', () => {
  let updateMemberSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  const emitSpy = jest.spyOn(EventEmitter, 'emit');

  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    mockUseRole();
    mockUseInstance();
    updateMemberSpy = mockUpdateMember();
    useLocationMock.mockImplementation(() => {
      return { state: { projectName } };
    });
    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseSelector({
      member: {
        modalStatus: {
          [ModalName.Update_Member]: true,
        },
        selectMember: mockMemberList[0],
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
    const { baseElement } = render(<UpdateMember />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should call update member request when clicking submit button', async () => {
    render(<UpdateMember />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(updateMemberSpy).toBeCalledTimes(0);
    expect(dispatchSpy).toBeCalledTimes(0);
    expect(emitSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByLabelText('member.memberForm.projectAdmin'));

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.getByText('common.close').closest('button')).toBeDisabled();
    expect(screen.getByText('common.submit').closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    expect(updateMemberSpy).toBeCalledTimes(1);
    expect(updateMemberSpy).toBeCalledWith({
      project_name: projectName,
      roles: mockMemberList[0].roles,
      user_name: mockMemberList[0].user_name,
      is_owner: true,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('member.updateMember.successTips')
    ).toBeInTheDocument();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Member,
        status: false,
      },
    });
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Member_List);
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
      screen.queryByText('member.updateMember.successTips')
    ).not.toBeInTheDocument();
  });

  test('should clear form and dispatch "updateMemberModalStatus" when clicking close button', async () => {
    render(<UpdateMember />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(0);

    expect(screen.getByLabelText('member.memberForm.username')).toHaveValue(
      mockMemberList[0].user_name
    );

    expect(screen.getByLabelText('member.memberForm.username')).toBeDisabled();

    fireEvent.click(screen.getByText('common.close'));

    expect(screen.getByLabelText('member.memberForm.username')).toHaveValue('');

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Member,
        status: false,
      },
    });
  });
});
