import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import OrderTotalNumbers from '../OrderTotalNumbers';
import mockRequestData from './mockRequestData';

const { OrderTotalNumbersData } = mockRequestData;

describe.skip('test OrderTotalNumbers', () => {
  const mockGetTaskCountV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowCountV1');
    spy.mockImplementation(() => resolveThreeSecond(OrderTotalNumbersData));
    return spy;
  };

  const mockErrorGetTaskCountV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowCountV1');
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
    mockGetTaskCountV1();
    const { container } = render(<OrderTotalNumbers />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowCountV1 when first rendered', () => {
    const getTaskCountV1Spy = mockGetTaskCountV1();
    expect(getTaskCountV1Spy).toBeCalledTimes(0);
    render(<OrderTotalNumbers />);
    expect(getTaskCountV1Spy).toBeCalledTimes(1);
  });

  test('should match snapshot when request goes wrong', async () => {
    const getTaskCountV1Spy = mockErrorGetTaskCountV1();
    const { container } = render(<OrderTotalNumbers />);
    expect(getTaskCountV1Spy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
