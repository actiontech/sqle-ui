import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import reportStatisticsData from '../../index.data';
import OrderAverageExecuteTimeTopN from '../OrderAverageExecuteTimeTopN';
import mockRequestData from './mockRequestData';

const { tableLimit } = reportStatisticsData;
const { SqlAverageExecutionTimeData } = mockRequestData;

describe('test SqlExecFailedTopN', () => {
  const mockGetSqlAverageExecutionTimeV1 = () => {
    const spy = jest.spyOn(statistic, 'getSqlAverageExecutionTimeV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(SqlAverageExecutionTimeData);
    });
    return spy;
  };
  const mockErrorGetSqlAverageExecutionTimeV1 = () => {
    const spy = jest.spyOn(statistic, 'getSqlAverageExecutionTimeV1');
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
    mockGetSqlAverageExecutionTimeV1();
    const { container } = render(<OrderAverageExecuteTimeTopN />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetSqlAverageExecutionTimeV1();
    const { container } = render(<OrderAverageExecuteTimeTopN />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowRejectedPercentGroupByCreatorV1 when first rendered', async () => {
    const getSqlAverageExecutionTimeV1Spy = mockGetSqlAverageExecutionTimeV1();
    render(<OrderAverageExecuteTimeTopN />);
    expect(getSqlAverageExecutionTimeV1Spy).toBeCalledTimes(1);
    expect(getSqlAverageExecutionTimeV1Spy).toBeCalledWith({
      limit: tableLimit,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
  });
});
