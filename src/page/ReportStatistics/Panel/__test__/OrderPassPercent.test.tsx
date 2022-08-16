import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import OrderPassPercent from '../OrderPassPercent';
import mockRequestData from './mockRequestData';

const { OrderPassPercentData } = mockRequestData;

describe.skip('test OrderPassPercent', () => {
  const mockGetTaskPassPercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowPassPercentV1');
    spy.mockImplementation(() => resolveThreeSecond(OrderPassPercentData));
    return spy;
  };

  const mockErrorGetTaskPassPercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowPassPercentV1');
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
    mockGetTaskPassPercentV1();
    const { container } = render(<OrderPassPercent />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
