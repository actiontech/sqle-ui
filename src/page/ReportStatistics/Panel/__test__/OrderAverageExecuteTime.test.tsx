import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import OrderAverageExecuteTime from '../OrderAverageExecuteTime';
import mockRequestData from './mockRequestData';

const { OrderAverageExecuteTimeData } = mockRequestData;

describe('test OrderAverageExecuteTime', () => {
  const mockGetTaskDurationOfWaitingForExecutionV1 = () => {
    const spy = jest.spyOn(statistic, 'getTaskDurationOfWaitingForExecutionV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(OrderAverageExecuteTimeData)
    );
    return spy;
  };

  const mockErrorGetTaskDurationOfWaitingForExecutionV1 = () => {
    const spy = jest.spyOn(statistic, 'getTaskDurationOfWaitingForExecutionV1');
    spy.mockImplementation(() => resolveErrorThreeSecond({}));
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
    mockGetTaskDurationOfWaitingForExecutionV1();
    const { container } = render(<OrderAverageExecuteTime />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getTaskDurationOfWaitingForExecutionV1 when first rendered', () => {
    const getTaskDurationOfWaitingForExecutionV1 =
      mockGetTaskDurationOfWaitingForExecutionV1();
    expect(getTaskDurationOfWaitingForExecutionV1).toBeCalledTimes(0);
    render(<OrderAverageExecuteTime />);
    expect(getTaskDurationOfWaitingForExecutionV1).toBeCalledTimes(1);
  });

  test('should match snapshot when request goes wrong', async () => {
    const getTaskDurationOfWaitingForExecutionV1 =
      mockErrorGetTaskDurationOfWaitingForExecutionV1();
    const { container } = render(<OrderAverageExecuteTime />);
    expect(getTaskDurationOfWaitingForExecutionV1).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
