import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import OrderAverageReviewTime from '../OrderAverageReviewTime';
import mockRequestData from './mockRequestData';

const { OrderAverageReviewTimeData } = mockRequestData;

describe('test OrderAverageReviewTime', () => {
  const mockGetTaskDurationOfWaitingForAuditV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowDurationOfWaitingForAuditV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(OrderAverageReviewTimeData)
    );
    return spy;
  };

  const mockErrorGetTaskDurationOfWaitingForAuditV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowDurationOfWaitingForAuditV1');
    spy.mockImplementation(() => resolveErrorThreeSecond({}));
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
    mockGetTaskDurationOfWaitingForAuditV1();
    const { container } = render(<OrderAverageReviewTime />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowDurationOfWaitingForAuditV1 when first rendered', () => {
    const getTaskDurationOfWaitingForAuditV1Spy =
      mockGetTaskDurationOfWaitingForAuditV1();
    expect(getTaskDurationOfWaitingForAuditV1Spy).toBeCalledTimes(0);
    render(<OrderAverageReviewTime />);
    expect(getTaskDurationOfWaitingForAuditV1Spy).toBeCalledTimes(1);
  });

  test('should match snapshot when request goes wrong', async () => {
    const getTaskDurationOfWaitingForAuditV1Spy =
      mockErrorGetTaskDurationOfWaitingForAuditV1();
    const { container } = render(<OrderAverageReviewTime />);
    expect(getTaskDurationOfWaitingForAuditV1Spy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
