import { render, act } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import InfoModalManager from '.';
import global from '../../../../api/global';
import { ModalName } from '../../../../data/ModalName';

import { resolveThreeSecond } from '../../../../testUtils/mockRequest';

const serverVersion = `"issue_201 b1c2baedcb37f27feb7cef34f088212938fad1ba"`;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('test Nav/Header/Modal', () => {
  const scopeDispatch = jest.fn();

  const mockGetSQLEInfo = () => {
    const spy = jest.spyOn(global, 'getSQLEInfoV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({ version: serverVersion })
    );
    return spy;
  };

  beforeEach(() => {
    mockGetSQLEInfo();

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

  test('should match snapshot', async () => {
    const { baseElement } = render(<InfoModalManager />);

    await act(async () => jest.advanceTimersByTime(3000));

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
