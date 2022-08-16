import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import reportStatisticsData from '../../index.data';
import DiffUserOrderRejectedPercent from '../DiffUserOrderRejectedPercent';
import mockRequestData from './mockRequestData';

const { tableLimit } = reportStatisticsData;
const { DiffUserOrderRejectedPercentData } = mockRequestData;

describe.skip('test DiffUserOrderRejectedPercent', () => {
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
    mockUseSelector({
      reportStatistics: { refreshFlag: false },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    mockGetTaskRejectedPercentGroupByCreatorV1();
    const { container } = render(<DiffUserOrderRejectedPercent />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetTaskRejectedPercentGroupByCreatorV1();
    const { container } = render(<DiffUserOrderRejectedPercent />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
  });
});
