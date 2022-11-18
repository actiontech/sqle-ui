import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import WhitelistList from '.';
import audit_whitelist from '../../../api/audit_whitelist';
import EmitterKey from '../../../data/EmitterKey';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { WhitelistData } from '../__testData__';

describe.skip('Whitelist/WhitelistList', () => {
  let dispatchMock: jest.Mock;
  let getWhitelistSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    const { scopeDispatch } = mockUseDispatch();
    dispatchMock = scopeDispatch;
    getWhitelistSpy = mockGetWhitelistList();
    mockUseSelector({ whitelist: { modalStatus: {} } });
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
});
