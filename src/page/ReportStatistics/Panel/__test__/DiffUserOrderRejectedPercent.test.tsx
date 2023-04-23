import { act, render } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import reportStatisticsData from '../../index.data';
import DiffUserOrderRejectedPercent from '../DiffUserOrderRejectedPercent';
import mockRequestData from './mockRequestData';
import { useSelector } from 'react-redux';

const { tableLimit } = reportStatisticsData;
const { DiffUserOrderRejectedPercentData } = mockRequestData;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

describe('test DiffUserOrderRejectedPercent', () => {
  const mockGetTaskRejectedPercentGroupByCreatorV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowRejectedPercentGroupByCreatorV1'
    );
    spy.mockImplementation(() => {
      return resolveThreeSecond(DiffUserOrderRejectedPercentData);
    });
    return spy;
  };
  const mockErrorGetTaskRejectedPercentGroupByCreatorV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowRejectedPercentGroupByCreatorV1'
    );
    spy.mockImplementation(() => {
      return resolveErrorThreeSecond({});
    });
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        reportStatistics: { refreshFlag: false },
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    mockGetTaskRejectedPercentGroupByCreatorV1();
    const { container } = render(<DiffUserOrderRejectedPercent />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetTaskRejectedPercentGroupByCreatorV1();
    const { container } = render(<DiffUserOrderRejectedPercent />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowRejectedPercentGroupByCreatorV1 when first rendered', async () => {
    const getTaskRejectedPercentGroupByCreatorV1Spy =
      mockGetTaskRejectedPercentGroupByCreatorV1();
    render(<DiffUserOrderRejectedPercent />);
    expect(getTaskRejectedPercentGroupByCreatorV1Spy).toBeCalledTimes(1);
    expect(getTaskRejectedPercentGroupByCreatorV1Spy).toBeCalledWith({
      limit: tableLimit,
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
