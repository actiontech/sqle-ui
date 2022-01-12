import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import VersionModal from './index';
import GlobalService from '../../../../../api/global';
import { AxiosResponse } from 'axios';
import { successData } from '../../../../../testUtils/mockRequest';

const serverVersion = `"issue_201 b1c2baedcb37f27feb7cef34f088212938fad1ba"`;
const formatServerVersion = `Server Version: issue_201 b1c2baedcb`;

const resolveThreeSecond = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        ...successData(data),
      });
    }, 3000);
  });
};

describe('Nav/Header/VersionModal', () => {
  let scopeDispatch: jest.Mock;
  const mockGetSQLEInfo = () => {
    const spy = jest.spyOn(GlobalService, 'getSQLEInfo');
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
