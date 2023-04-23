import { act, render } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import OrderTotalNumbers from '../OrderTotalNumbers';
import mockRequestData from './mockRequestData';
import { useSelector } from 'react-redux';

const { OrderTotalNumbersData } = mockRequestData;

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

describe('test OrderTotalNumbers', () => {
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
    mockGetTaskCountV1();
    const { container } = render(<OrderTotalNumbers />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
