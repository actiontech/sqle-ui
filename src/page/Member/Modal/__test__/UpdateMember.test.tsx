import { act, fireEvent, render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';

import {
  mockUseInstance,
  mockUseRole,
  mockUseUsername,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockMemberList } from '../../MemberList/__test__/utils';
import UpdateMember from '../UpdateMember';
import { mockUpdateMember } from './utils';
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

describe('test UpdateMember', () => {
  let updateMemberSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  const emitSpy = jest.spyOn(EventEmitter, 'emit');

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    mockUseRole();
    mockUseUsername();
    mockUseInstance();
    updateMemberSpy = mockUpdateMember();
    useParamsMock.mockReturnValue({ projectName });
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        member: {
          modalStatus: {
            [ModalName.Update_Member]: true,
          },
          selectMember: mockMemberList[0],
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
    const { baseElement } = render(<UpdateMember />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should call update member request when clicking submit button', async () => {
    render(<UpdateMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateMemberSpy).toBeCalledTimes(0);
    expect(dispatchSpy).toBeCalledTimes(0);
    expect(emitSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByLabelText('member.memberForm.projectAdmin'));

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('common.close').closest('button')).toBeDisabled();
    expect(screen.getByText('common.submit').closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    expect(updateMemberSpy).toBeCalledTimes(1);
    expect(updateMemberSpy).toBeCalledWith({
      project_name: projectName,
      roles: mockMemberList[0].roles,
      user_name: mockMemberList[0].user_name,
      is_manager: true,
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('member.updateMember.successTips')
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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('member.updateMember.successTips')
    ).not.toBeInTheDocument();
  });

  test('should clear form and dispatch "updateMemberModalStatus" when clicking close button', async () => {
    render(<UpdateMember />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dispatchSpy).toBeCalledTimes(0);

    expect(screen.getAllByText(mockMemberList[0].user_name!)[0]).toHaveClass(
      'ant-select-selection-item'
    );

    expect(screen.getByLabelText('member.memberForm.username')).toBeDisabled();

    fireEvent.click(screen.getByText('common.close'));

    expect(
      screen.queryAllByText(mockMemberList[0].user_name!)[0]
    ).toBeUndefined();

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
