import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import VersionModal from './index';
import GlobalService from '../../../../../api/global';
import { modalTestData } from '../index.test.data';

const { formatServerVersion, serverVersion, resolveThreeSecond } =
  modalTestData;

describe('Nav/Header/VersionModal', () => {
  let scopeDispatch: jest.Mock;
  const mockGetSQLEInfo = () => {
    const spy = jest.spyOn(GlobalService, 'getSQLEInfoV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({ version: serverVersion })
    );
    return spy;
  };
  beforeEach(() => {
    mockUseSelector({
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: true } },
    });

    scopeDispatch = mockUseDispatch().scopeDispatch;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should get server version information when modal is opened', () => {
    const getSQLEInfo = mockGetSQLEInfo();
    render(<VersionModal />);
    expect(getSQLEInfo).toBeCalledTimes(1);
    expect(screen.getByText('common.showMore').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/actiontech/sqle'
    );
  });

  test('should close modal when click the close button', async () => {
    mockGetSQLEInfo();
    render(<VersionModal />);

    const closeBtn = screen.getByText('common.close');
    fireEvent.click(closeBtn);
    expect(scopeDispatch).toBeCalledTimes(1);
    expect(scopeDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.SHOW_VERSION,
        status: false,
      },
      type: 'nav/updateModalStatus',
    });
  });

  test('should be able to process server version data as expected', async () => {
    const getSQLEInfo = mockGetSQLEInfo();
    render(<VersionModal />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getSQLEInfo).toBeCalledTimes(1);
    expect(screen.getByText(formatServerVersion)).toBeInTheDocument();
  });
});
