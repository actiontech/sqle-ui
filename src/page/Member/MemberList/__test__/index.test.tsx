import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useLocation } from 'react-router-dom';
import MemberList from '..';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import { mockUseDispatch } from '../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseUsername,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockDeleteMember, mockGetMembers, mockMemberList } from './utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
const projectName = 'test';

describe('test MemberList', () => {
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  let getMembersSpy: jest.SpyInstance;
  let deleteMemberSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    getMembersSpy = mockGetMembers();
    deleteMemberSpy = mockDeleteMember();
    mockUseUsername();
    mockUseInstance();
    useLocationMock.mockImplementation(() => {
      return { state: { projectName } };
    });
    dispatchSpy = mockUseDispatch().scopeDispatch;

    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    useLocationMock.mockRestore();
  });

  test('should match snapshot', async () => {
    const { container } = render(<MemberList />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should call refresh list request when receive event from EventEmit', async () => {
    expect(getMembersSpy).toBeCalledTimes(0);
    render(<MemberList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMembersSpy).toBeCalledTimes(1);
    expect(getMembersSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });

    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Member_List);
    });

    expect(getMembersSpy).toBeCalledTimes(2);
    expect(getMembersSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
  });

  test('should call refresh list request when clicking search button and reset button', async () => {
    expect(getMembersSpy).toBeCalledTimes(0);
    render(<MemberList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMembersSpy).toBeCalledTimes(1);
    expect(getMembersSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });

    selectOptionByIndex('member.memberList.filterForm.username', 'user_name1');
    selectOptionByIndex('member.memberList.filterForm.instance', 'instance1');
    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(getMembersSpy).toBeCalledTimes(2);
    expect(getMembersSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
      filter_user_name: 'user_name1',
      filter_instance_name: 'instance1',
    });

    fireEvent.click(screen.getByText('common.reset'));
    expect(getMembersSpy).toBeCalledTimes(3);
    expect(getMembersSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
  });

  test('should dispatch "updateMemberModalStatus" when clicking create button', async () => {
    render(<MemberList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('member.memberList.createAction'));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Member,
        status: true,
      },
    });
  });

  test('should dispatch "updateSelectMember" and "updateMemberModalStatus" when clicking edit button', async () => {
    render(<MemberList />);
    expect(screen.queryByText('common.edit')).not.toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.edit')).toBeInTheDocument();

    expect(dispatchSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.edit'));

    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateSelectMember',
      payload: {
        member: mockMemberList[0],
      },
    });
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Member,
        status: true,
      },
    });
  });

  test('should call delete member request when clicking delete button', async () => {
    render(<MemberList />);
    expect(getMembersSpy).toBeCalledTimes(1);

    expect(screen.queryByText('common.delete')).not.toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.delete')).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.delete'));

    expect(
      screen.queryByText('member.memberList.tableColumn.confirmTitle')
    ).toBeInTheDocument();

    expect(deleteMemberSpy).toBeCalledTimes(0);
    fireEvent.click(screen.getByText('common.ok'));

    expect(deleteMemberSpy).toBeCalledTimes(1);
    expect(deleteMemberSpy).toBeCalledWith({
      user_name: mockMemberList[0].user_name,
      project_name: projectName,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('member.memberList.deleteSuccessTips')
    ).toBeInTheDocument();
    expect(getMembersSpy).toBeCalledTimes(2);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('member.memberList.deleteSuccessTips')
    ).not.toBeInTheDocument();
  });
});
