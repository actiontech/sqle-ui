import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import reportStatisticsData from '../../index.data';
import DiffInstanceOrderRejectedPercent from '../DiffInstanceOrderRejectedPercent';
import mockRequestData from './mockRequestData';

const { tableLimit } = reportStatisticsData;
const { DiffInstanceOrderRejectedPercentData } = mockRequestData;
describe('test DiffInstanceOrderRejectedPercent', () => {
  const mockGetTaskRejectedPercentGroupByInstanceV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getTaskRejectedPercentGroupByInstanceV1'
    );
    spy.mockImplementation(() => {
      return resolveThreeSecond(DiffInstanceOrderRejectedPercentData);
    });
    return spy;
  };
  const mockErrorGetTaskRejectedPercentGroupByInstanceV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getTaskRejectedPercentGroupByInstanceV1'
    );
    spy.mockImplementation(() => {
      return resolveErrorThreeSecond({});
    });
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    mockGetTaskRejectedPercentGroupByInstanceV1();
    const { container } = render(<DiffInstanceOrderRejectedPercent />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetTaskRejectedPercentGroupByInstanceV1();
    const { container } = render(<DiffInstanceOrderRejectedPercent />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getTaskRejectedPercentGroupByCreatorV1 when first rendered', async () => {
    const getTaskRejectedPercentGroupByCreatorV1Spy =
      mockGetTaskRejectedPercentGroupByInstanceV1();
    render(<DiffInstanceOrderRejectedPercent />);
    expect(getTaskRejectedPercentGroupByCreatorV1Spy).toBeCalledTimes(1);
    expect(getTaskRejectedPercentGroupByCreatorV1Spy).toBeCalledWith({
      limit: tableLimit,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
  });
});
