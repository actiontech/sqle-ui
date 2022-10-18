import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import reportStatisticsData from '../../index.data';
import SqlExecFailedTopN from '../SqlExecFailedTopN';
import mockRequestData from './mockRequestData';

const { tableLimit } = reportStatisticsData;
const { SqlExecFailedTopNData } = mockRequestData;

describe('test SqlExecFailedTopN', () => {
  const mockGetSqlExecutionFailPercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getSqlExecutionFailPercentV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(SqlExecFailedTopNData);
    });
    return spy;
  };
  const mockErrorGetSqlExecutionFailPercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getSqlExecutionFailPercentV1');
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
    mockGetSqlExecutionFailPercentV1();
    const { container } = render(<SqlExecFailedTopN />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetSqlExecutionFailPercentV1();
    const { container } = render(<SqlExecFailedTopN />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowRejectedPercentGroupByCreatorV1 when first rendered', async () => {
    const getSqlExecutionFailPercentV1Spy = mockGetSqlExecutionFailPercentV1();
    render(<SqlExecFailedTopN />);
    expect(getSqlExecutionFailPercentV1Spy).toBeCalledTimes(1);
    expect(getSqlExecutionFailPercentV1Spy).toBeCalledWith({
      limit: tableLimit,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
  });
});
