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
import { mockMemberGroupList } from '../../MemberGroupList/__test__/utils';
import UpdateMemberGroup from '../UpdateMemberGroup';
import { mockUpdateMemberGroup } from './utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
const projectName = 'test';

describe('test UpdateMemberGroup', () => {
  let updateMemberGroupSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  const emitSpy = jest.spyOn(EventEmitter, 'emit');

  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    mockUseRole();
    mockUseInstance();
    updateMemberGroupSpy = mockUpdateMemberGroup();
    useLocationMock.mockImplementation(() => {
      return { state: { projectName } };
    });
    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseSelector({
      member: {
        modalStatus: {
          [ModalName.Update_Member_Group]: true,
        },
        selectMemberGroup: mockMemberGroupList[0],
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
    const { baseElement } = render(<UpdateMemberGroup />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should call update member group request when clicking submit button', async () => {
    render(<UpdateMemberGroup />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(updateMemberGroupSpy).toBeCalledTimes(0);
    expect(dispatchSpy).toBeCalledTimes(0);
    expect(emitSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.getByText('common.close').closest('button')).toBeDisabled();
    expect(screen.getByText('common.submit').closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    expect(updateMemberGroupSpy).toBeCalledTimes(1);
    expect(updateMemberGroupSpy).toBeCalledWith({
      project_name: projectName,
      roles: mockMemberGroupList[0].roles,
      user_group_name: mockMemberGroupList[0].user_group_name,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('member.updateMemberGroup.successTips')
    ).toBeInTheDocument();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Member_Group,
        status: false,
      },
    });
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Member_Group_List);
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
      screen.queryByText('member.updateMemberGroup.successTips')
    ).not.toBeInTheDocument();
  });

  test('should clear form and dispatch "updateMemberModalStatus" when clicking close button', async () => {
    render(<UpdateMemberGroup />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(0);

    expect(
      screen.getByLabelText('member.memberGroupForm.userGroupName')
    ).toHaveValue(mockMemberGroupList[0].user_group_name);
    expect(
      screen.getByLabelText('member.memberGroupForm.userGroupName')
    ).toBeDisabled();

    fireEvent.click(screen.getByText('common.close'));

    expect(
      screen.getByLabelText('member.memberGroupForm.userGroupName')
    ).toHaveValue('');

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Member_Group,
        status: false,
      },
    });
  });
});
