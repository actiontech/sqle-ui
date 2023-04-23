import { render, act } from '@testing-library/react';
import PersonalizeSetting from '..';
import global from '../../../../api/global';
import { SQLE_DEFAULT_WEB_TITLE } from '../../../../data/common';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import { useDispatch } from 'react-redux';

const mockGetSqleInfo = () => {
  const spy = jest.spyOn(global, 'getSQLEInfoV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      title: 'SQLE',
      logo_url: 'test',
    })
  );
  return spy;
};

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
  };
});

describe('test PersonalizeSetting', () => {
  let getSqleInfoSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    getSqleInfoSpy = mockGetSqleInfo();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  test('should match snapshot', async () => {
    const { container } = render(<PersonalizeSetting />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should dispatch "updateWebTitleAndLog" action and set document title after getting sqle data from the request', async () => {
    render(<PersonalizeSetting />);
    expect(getSqleInfoSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(document.title).toBe('SQLE');
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        webLogoUrl: 'test',
        webTitle: 'SQLE',
      },
      type: 'system/updateWebTitleAndLog',
    });
  });

  test('should set default title when the fetched title is undefined', async () => {
    getSqleInfoSpy.mockImplementation(() => resolveThreeSecond({}));
    render(<PersonalizeSetting />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(document.title).toBe(SQLE_DEFAULT_WEB_TITLE);
  });
});
