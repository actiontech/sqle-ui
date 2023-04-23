import { fireEvent, render, screen, act } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';

import VersionModal from './index';
import GlobalService from '../../../../../api/global';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import { useDispatch, useSelector } from 'react-redux';

const serverVersion = `"issue_201 b1c2baedcb37f27feb7cef34f088212938fad1ba"`;
const formatServerVersion = `Server Version: issue_201 b1c2baedcb`;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('Nav/Header/VersionModal', () => {
  const scopeDispatch = jest.fn();
  const mockGetSQLEInfo = () => {
    const spy = jest.spyOn(GlobalService, 'getSQLEInfoV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({ version: serverVersion })
    );
    return spy;
  };
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        nav: { modalStatus: { [ModalName.SHOW_VERSION]: true } },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
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

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSQLEInfo).toBeCalledTimes(1);
    expect(screen.getByText(formatServerVersion)).toBeInTheDocument();
  });
});
