import {
  fireEvent,
  render,
  waitFor,
  screen,
  cleanup,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useParams } from 'react-router-dom';
import WhitelistList from '.';
import audit_whitelist from '../../../api/audit_whitelist';
import { SystemRole } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { WhitelistData } from '../__testData__';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

describe('Whitelist/WhitelistList', () => {
  let dispatchMock: jest.Mock;
  let getWhitelistSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    const { scopeDispatch } = mockUseDispatch();
    dispatchMock = scopeDispatch;
    getWhitelistSpy = mockGetWhitelistList();
    mockUseSelector({
      whitelist: { modalStatus: {} },
      user: { role: SystemRole.admin, bindProjects: mockBindProjects },
    });
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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getAllByText('common.delete')[0]);
    expect(
      screen.queryByText('whitelist.operate.confirmDelete')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(
      screen.queryByText('whitelist.operate.deleting')
    ).toBeInTheDocument();

    expect(deleteWhiteListSpy).toBeCalledTimes(1);
    expect(deleteWhiteListSpy).toBeCalledWith({
      audit_whitelist_id: `${WhitelistData[0].audit_whitelist_id}`,
      project_name: projectName,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('whitelist.operate.deleting')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('whitelist.operate.deleteSuccess')
    ).toBeInTheDocument();

    expect(getWhitelistSpy).toBeCalledTimes(2);
  });

  test('should refresh table data when receive Refresh_Whitelist_List event', async () => {
    render(<WhitelistList />);
    expect(getWhitelistSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Whitelist_List);
    });
    expect(getWhitelistSpy).toBeCalledTimes(2);
  });

  test('should hide the Create, Add, Edit feature when not currently a project manager or admin', async () => {
    mockUseSelector({
      whitelist: { modalStatus: {} },
      user: {
        role: SystemRole.admin,
        bindProjects: [{ projectName: 'test', isManager: false }],
      },
    });

    render(<WhitelistList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('common.edit')[0]).toBeInTheDocument();
    expect(
      screen.queryByText('whitelist.operate.addWhitelist')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      whitelist: { modalStatus: {} },
      user: {
        role: '',
        bindProjects: mockBindProjects,
      },
    });
    render(<WhitelistList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('common.edit')[0]).toBeInTheDocument();
    expect(
      screen.queryByText('whitelist.operate.addWhitelist')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      whitelist: { modalStatus: {} },
      user: {
        role: '',
        bindProjects: [{ projectName: 'default', isManager: false }],
      },
    });
    render(<WhitelistList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.delete')).not.toBeInTheDocument();
    expect(screen.queryByText('common.edit')).not.toBeInTheDocument();
    expect(
      screen.queryByText('whitelist.operate.addWhitelist')
    ).not.toBeInTheDocument();
  });
});
