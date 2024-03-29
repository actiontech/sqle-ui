import { act, fireEvent, render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';

import {
  mockUseInstance,
  mockUseRole,
  mockUseUserGroup,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockMemberGroupList } from '../../MemberGroupList/__test__/utils';
import UpdateMemberGroup from '../UpdateMemberGroup';
import { mockUpdateMemberGroup } from './utils';
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

describe('test UpdateMemberGroup', () => {
  let updateMemberGroupSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  const emitSpy = jest.spyOn(EventEmitter, 'emit');

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    mockUseRole();
    mockUseUserGroup();
    mockUseInstance();
    updateMemberGroupSpy = mockUpdateMemberGroup();
    useParamsMock.mockReturnValue({ projectName });
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: {
            [ModalName.Update_Member_Group]: true,
          },
          selectMemberGroup: mockMemberGroupList[0],
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
    const { baseElement } = render(<UpdateMemberGroup />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should call update member group request when clicking submit button', async () => {
    render(<UpdateMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateMemberGroupSpy).toBeCalledTimes(0);
    expect(dispatchSpy).toBeCalledTimes(0);
    expect(emitSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

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

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('member.updateMemberGroup.successTips')
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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('member.updateMemberGroup.successTips')
    ).not.toBeInTheDocument();
  });

  test('should clear form and dispatch "updateMemberModalStatus" when clicking close button', async () => {
    render(<UpdateMemberGroup />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dispatchSpy).toBeCalledTimes(0);

    expect(
      screen.getAllByText(mockMemberGroupList[0].user_group_name!)[0]
    ).toHaveClass('ant-select-selection-item');
    expect(
      screen.getByLabelText('member.memberGroupForm.userGroupName')
    ).toBeDisabled();

    fireEvent.click(screen.getByText('common.close'));

    expect(
      screen.queryAllByText(mockMemberGroupList[0].user_group_name!)[0]
    ).toBeUndefined();

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
