import { act, render } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import OrderAverageReviewTime from '../OrderAverageReviewTime';
import mockRequestData from './mockRequestData';
import { useSelector } from 'react-redux';

const { OrderAverageReviewTimeData } = mockRequestData;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

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
    mockGetTaskDurationOfWaitingForAuditV1();
    const { container } = render(<OrderAverageReviewTime />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
