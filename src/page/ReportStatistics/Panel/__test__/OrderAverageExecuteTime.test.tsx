import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import OrderAverageExecuteTime from '../OrderAverageExecuteTime';
import mockRequestData from './mockRequestData';

const { OrderAverageExecuteTimeData } = mockRequestData;

describe.skip('test OrderAverageExecuteTime', () => {
  const mockGetTaskDurationOfWaitingForExecutionV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowDurationOfWaitingForExecutionV1'
    );
    spy.mockImplementation(() =>
      resolveThreeSecond(OrderAverageExecuteTimeData)
    );
    return spy;
  };

  const mockErrorGetTaskDurationOfWaitingForExecutionV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowDurationOfWaitingForExecutionV1'
    );
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
    mockGetTaskDurationOfWaitingForExecutionV1();
    const { container } = render(<OrderAverageExecuteTime />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowDurationOfWaitingForExecutionV1 when first rendered', () => {
    const getWorkflowDurationOfWaitingForExecutionV1 =
      mockGetTaskDurationOfWaitingForExecutionV1();
    expect(getWorkflowDurationOfWaitingForExecutionV1).toBeCalledTimes(0);
    render(<OrderAverageExecuteTime />);
    expect(getWorkflowDurationOfWaitingForExecutionV1).toBeCalledTimes(1);
  });

  test('should match snapshot when request goes wrong', async () => {
    const getWorkflowDurationOfWaitingForExecutionV1 =
      mockErrorGetTaskDurationOfWaitingForExecutionV1();
    const { container } = render(<OrderAverageExecuteTime />);
    expect(getWorkflowDurationOfWaitingForExecutionV1).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
