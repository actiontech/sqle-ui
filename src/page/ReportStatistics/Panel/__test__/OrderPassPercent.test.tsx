import { act, render } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import OrderPassPercent from '../OrderPassPercent';
import mockRequestData from './mockRequestData';
import { useSelector } from 'react-redux';

const { OrderPassPercentData } = mockRequestData;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

describe('test OrderPassPercent', () => {
  const mockGetTaskPassPercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowAuditPassPercentV1');
    spy.mockImplementation(() => resolveThreeSecond(OrderPassPercentData));
    return spy;
  };

  const mockErrorGetTaskPassPercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowAuditPassPercentV1');
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
    mockGetTaskPassPercentV1();
    const { container } = render(<OrderPassPercent />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowPassPercentV1 when first rendered', () => {
    const getTaskPassPercentV1Spy = mockGetTaskPassPercentV1();
    expect(getTaskPassPercentV1Spy).toBeCalledTimes(0);
    render(<OrderPassPercent />);
    expect(getTaskPassPercentV1Spy).toBeCalledTimes(1);
  });

  test('should match snapshot when request goes wrong', async () => {
    const getTaskPassPercentV1Spy = mockErrorGetTaskPassPercentV1();
    const { container } = render(<OrderPassPercent />);
    expect(getTaskPassPercentV1Spy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
