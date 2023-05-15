import {
  fireEvent,
  render,
  act,
  screen,
  cleanup,
} from '@testing-library/react';
import { useParams } from 'react-router-dom';
import WhitelistList from '.';
import audit_whitelist from '../../../api/audit_whitelist';
import { SystemRole } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { WhitelistData } from '../__testData__';
import { useDispatch, useSelector } from 'react-redux';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test.data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('Whitelist/WhitelistList', () => {
  let getWhitelistSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    getWhitelistSpy = mockGetWhitelistList();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: {} },
        user: { role: SystemRole.admin, bindProjects: mockBindProjects },
        projectManage: { archived: false },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchMock);
    useParamsMock.mockReturnValue({ projectName });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const mockGetWhitelistList = () => {
    const spy = jest.spyOn(audit_whitelist, 'getAuditWhitelistV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(WhitelistData, { otherData: { total_nums: 13 } })
    );
    return spy;
  };

  test('should init modal state at component init', async () => {
    const { container } = render(<WhitelistList />);
    expect(container).toMatchSnapshot();
    expect(dispatchMock).toBeCalledTimes(1);
    expect(getWhitelistSpy).toBeCalledTimes(1);
    expect(getWhitelistSpy).toBeCalledWith({
      page_index: '1',
      page_size: '10',
      project_name: projectName,
    });
    expect(dispatchMock).toBeCalledWith({
      payload: {
        modalStatus: {
          ADD_WHITELIST: false,
          UPDATE_WHITELIST: false,
        },
      },
      type: 'whitelist/initModalStatus',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should set add whitelist modal visible to true when user click add whitelist button', async () => {
    render(<WhitelistList />);
    fireEvent.click(screen.getByText('whitelist.operate.addWhitelist'));

    expect(dispatchMock).toBeCalledTimes(2);
    expect(dispatchMock).nthCalledWith(2, {
      payload: {
        modalName: 'ADD_WHITELIST',
        status: true,
      },
      type: 'whitelist/updateModalStatus',
    });
  });

  test('should set update whitelist modal visible to true and set select whitelist when user click update whitelist button', async () => {
    render(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('common.edit')[0]);

    expect(dispatchMock).toBeCalledTimes(3);
    expect(dispatchMock).nthCalledWith(2, {
      payload: {
        whitelist: WhitelistData[0],
      },
      type: 'whitelist/updateSelectWhitelist',
    });
    expect(dispatchMock).nthCalledWith(3, {
      payload: {
        modalName: 'UPDATE_WHITELIST',
        status: true,
      },
      type: 'whitelist/updateModalStatus',
    });
  });

  test('should delete whitelist when user confirm to delete whitelist', async () => {
    const deleteWhiteListSpy = jest.spyOn(
      audit_whitelist,
      'deleteAuditWhitelistByIdV1'
    );
    deleteWhiteListSpy.mockImplementation(() => resolveThreeSecond({}));
    render(<WhitelistList />);
    expect(getWhitelistSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('common.delete')[0]);
    expect(
      screen.getByText('whitelist.operate.confirmDelete')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(screen.getByText('whitelist.operate.deleting')).toBeInTheDocument();

    expect(deleteWhiteListSpy).toBeCalledTimes(1);
    expect(deleteWhiteListSpy).toBeCalledWith({
      audit_whitelist_id: `${WhitelistData[0].audit_whitelist_id}`,
      project_name: projectName,
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('whitelist.operate.deleting')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('whitelist.operate.deleteSuccess')
    ).toBeInTheDocument();

    expect(getWhitelistSpy).toBeCalledTimes(2);
  });

  test('should refresh table data when receive Refresh_Whitelist_List event', async () => {
    render(<WhitelistList />);
    expect(getWhitelistSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Whitelist_List);
    });
    expect(getWhitelistSpy).toBeCalledTimes(2);
  });

  test('should hide the Create, Add, Edit feature when not currently a project manager or admin', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: {} },
        user: {
          role: SystemRole.admin,
          bindProjects: [{ projectName: 'test', isManager: false }],
        },
        projectManage: { archived: false },
      })
    );

    render(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getAllByText('common.delete')[0]).toBeInTheDocument();
    expect(screen.getAllByText('common.edit')[0]).toBeInTheDocument();
    expect(
      screen.getByText('whitelist.operate.addWhitelist')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: {} },
        user: {
          role: '',
          bindProjects: mockBindProjects,
        },
        projectManage: { archived: false },
      })
    );
    render(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getAllByText('common.delete')[0]).toBeInTheDocument();
    expect(screen.getAllByText('common.edit')[0]).toBeInTheDocument();
    expect(
      screen.getByText('whitelist.operate.addWhitelist')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: {} },
        user: {
          role: '',
          bindProjects: [{ projectName: 'default', isManager: false }],
        },
        projectManage: { archived: false },
      })
    );
    render(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('common.delete')).not.toBeInTheDocument();
    expect(screen.queryByText('common.edit')).not.toBeInTheDocument();
    expect(
      screen.queryByText('whitelist.operate.addWhitelist')
    ).not.toBeInTheDocument();
  });

  test('should hide the Create, Delete, Edit feature when project is archived', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: {} },
        user: {
          role: SystemRole.admin,
          bindProjects: [{ projectName: projectName, isManager: true }],
        },
        projectManage: { archived: true },
      })
    );
    render(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('common.delete')).not.toBeInTheDocument();
    expect(screen.queryByText('common.edit')).not.toBeInTheDocument();
    expect(
      screen.queryByText('whitelist.operate.addWhitelist')
    ).not.toBeInTheDocument();
  });
});
