import { act, render } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import reportStatisticsData from '../../index.data';
import OrderAverageExecuteTimeTopN from '../OrderAverageExecuteTimeTopN';
import mockRequestData from './mockRequestData';
import { useSelector } from 'react-redux';

const { tableLimit } = reportStatisticsData;
const { SqlAverageExecutionTimeData } = mockRequestData;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

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
    mockGetSqlAverageExecutionTimeV1();
    const { container } = render(<OrderAverageExecuteTimeTopN />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetSqlAverageExecutionTimeV1();
    const { container } = render(<OrderAverageExecuteTimeTopN />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowRejectedPercentGroupByCreatorV1 when first rendered', async () => {
    const getSqlAverageExecutionTimeV1Spy = mockGetSqlAverageExecutionTimeV1();
    render(<OrderAverageExecuteTimeTopN />);
    expect(getSqlAverageExecutionTimeV1Spy).toBeCalledTimes(1);
    expect(getSqlAverageExecutionTimeV1Spy).toBeCalledWith({
      limit: tableLimit,
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
