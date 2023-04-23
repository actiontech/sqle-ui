import { act, render } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import reportStatisticsData from '../../index.data';
import SqlExecFailedTopN from '../SqlExecFailedTopN';
import mockRequestData from './mockRequestData';
import { useSelector } from 'react-redux';

const { tableLimit } = reportStatisticsData;
const { SqlExecFailedTopNData } = mockRequestData;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

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
    mockGetSqlExecutionFailPercentV1();
    const { container } = render(<SqlExecFailedTopN />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetSqlExecutionFailPercentV1();
    const { container } = render(<SqlExecFailedTopN />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowRejectedPercentGroupByCreatorV1 when first rendered', async () => {
    const getSqlExecutionFailPercentV1Spy = mockGetSqlExecutionFailPercentV1();
    render(<SqlExecFailedTopN />);
    expect(getSqlExecutionFailPercentV1Spy).toBeCalledTimes(1);
    expect(getSqlExecutionFailPercentV1Spy).toBeCalledWith({
      limit: tableLimit,
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
