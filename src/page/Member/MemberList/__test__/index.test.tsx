import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useParams } from 'react-router-dom';
import MemberList from '..';
import { SystemRole } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';

import {
  mockUseInstance,
  mockUseMember,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockDeleteMember, mockGetMembers, mockMemberList } from './utils';
import { useDispatch, useSelector } from 'react-redux';
import { mockBindProjects } from '../../../../hooks/useCurrentUser/index.test.data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = mockBindProjects[0].project_name;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('test MemberList', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getMembersSpy: jest.SpyInstance;
  let deleteMemberSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    getMembersSpy = mockGetMembers();
    deleteMemberSpy = mockDeleteMember();
    mockUseMember();
    mockUseInstance();
    useParamsMock.mockReturnValue({ projectName });
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { role: SystemRole.admin, bindProjects: mockBindProjects },
        projectManage: { archived: false },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);

    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { container } = render(<MemberList />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();

    cleanup();

    getMembersSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          is_manager: true,
          user_name: 'test2',
          roles: [],
        },
      ])
    );

    const { container: container2 } = render(<MemberList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container2).toMatchSnapshot();
  });

  test('should call refresh list request when receive event from EventEmit', async () => {
    expect(getMembersSpy).toBeCalledTimes(0);
    render(<MemberList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMembersSpy).toBeCalledTimes(1);
    expect(getMembersSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });

    await act(() => {
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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMembersSpy).toBeCalledTimes(1);
    expect(getMembersSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });

    selectOptionByIndex('member.memberList.filterForm.username', 'member1');
    selectOptionByIndex('member.memberList.filterForm.instance', 'instance1');

    fireEvent.click(screen.getByText('common.search'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getMembersSpy).toBeCalledTimes(2);
    expect(getMembersSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
      filter_user_name: 'member1',
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
    await act(async () => jest.advanceTimersByTime(3000));

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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.edit')).toBeInTheDocument();

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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.delete')).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.delete'));

    expect(
      screen.getByText('member.memberList.tableColumn.confirmTitle')
    ).toBeInTheDocument();

    expect(deleteMemberSpy).toBeCalledTimes(0);
    fireEvent.click(screen.getByText('common.ok'));

    expect(deleteMemberSpy).toBeCalledTimes(1);
    expect(deleteMemberSpy).toBeCalledWith({
      user_name: mockMemberList[0].user_name,
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('member.memberList.deleteSuccessTips')
    ).toBeInTheDocument();
    expect(getMembersSpy).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('member.memberList.deleteSuccessTips')
    ).not.toBeInTheDocument();
  });

  test('should hide the Create, Add, Edit feature when not currently a project manager or admin', async () => {
    // mockUseSelector({
    //   user: {
    //     role: SystemRole.admin,
    //     bindProjects: [{ projectName: 'test', isManager: false }],
    //   },
    //   projectManage: { archived: false },
    // });
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: SystemRole.admin,
          bindProjects: [{ projectName: 'test', isManager: false }],
        },
        projectManage: { archived: false },
      })
    );

    render(<MemberList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.delete')).toBeInTheDocument();
    expect(screen.getByText('common.edit')).toBeInTheDocument();
    expect(
      screen.getByText('member.memberList.createAction')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: '',
          bindProjects: mockBindProjects,
        },
        projectManage: { archived: false },
      })
    );
    render(<MemberList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.delete')).toBeInTheDocument();
    expect(screen.getByText('common.edit')).toBeInTheDocument();
    expect(
      screen.getByText('member.memberList.createAction')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: '',
          bindProjects: [{ projectName: 'default', isManager: false }],
        },
        projectManage: { archived: false },
      })
    );
    render(<MemberList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('common.delete')).not.toBeInTheDocument();
    expect(screen.queryByText('common.edit')).not.toBeInTheDocument();
    expect(
      screen.queryByText('member.memberList.createAction')
    ).not.toBeInTheDocument();
  });

  test('should hide the Create, Delete, Edit feature when project is archived', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: SystemRole.admin,
          bindProjects: [{ projectName: projectName, isManager: true }],
        },
        projectManage: { archived: true },
      })
    );

    render(<MemberList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryAllByText('common.delete')[0]).toBeUndefined();
    expect(screen.queryAllByText('common.edit')[0]).toBeUndefined();
    expect(
      screen.queryByText('member.memberList.createAction')
    ).not.toBeInTheDocument();
  });
});
