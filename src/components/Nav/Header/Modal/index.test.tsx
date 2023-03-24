import { render, waitFor } from '@testing-library/react';
import InfoModalManager from '.';
import global from '../../../../api/global';
import { ModalName } from '../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';

const serverVersion = `"issue_201 b1c2baedcb37f27feb7cef34f088212938fad1ba"`;

describe('test Nav/Header/Modal', () => {
  let scopeDispatch: jest.Mock;

  const mockGetSQLEInfo = () => {
    const spy = jest.spyOn(global, 'getSQLEInfoV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({ version: serverVersion })
    );
    return spy;
  };

  beforeEach(() => {
    mockGetSQLEInfo();
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

  test('should match snapshot', async () => {
    const { baseElement } = render(<InfoModalManager />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(baseElement).toMatchSnapshot();
  });

  test('should init modal status when the modal was first rendered', () => {
    expect(scopeDispatch).toBeCalledTimes(0);
    render(<InfoModalManager />);
    expect(scopeDispatch).toBeCalledTimes(1);
    expect(scopeDispatch).toBeCalledWith({
      payload: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
      type: 'nav/initModalStatus',
    });
  });
});
