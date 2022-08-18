/* eslint-disable no-console */
import { useTheme } from '@material-ui/styles';
import { render, waitFor } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { SupportLanguage } from '../../../../locale';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../theme';
import OrderStatus from '../OrderStatus';
import mockRequestData from './mockRequestData';

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: jest.fn(),
  };
});

const { OrderStatusData } = mockRequestData;
const error = console.error;

describe('test OrderStatus', () => {
  const mockGetTaskStatusCountV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowStatusCountV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(OrderStatusData);
    });
    return spy;
  };

  const mockErrorGetTaskStatusCountV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowStatusCountV1');
    spy.mockImplementation(() => {
      return resolveErrorThreeSecond({});
    });
    return spy;
  };

  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  beforeEach(() => {
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });
    jest.useFakeTimers();

    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
      reportStatistics: { refreshFlag: false },
    });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    console.error = error;
  });

  it('should match snapshot', async () => {
    mockGetTaskStatusCountV1();
    const { container } = render(<OrderStatus />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetTaskStatusCountV1();
    const { container } = render(<OrderStatus />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowStatusCountV1 when first rendered', async () => {
    const getTaskStatusCountV1Spy = mockGetTaskStatusCountV1();
    render(<OrderStatus />);
    expect(getTaskStatusCountV1Spy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
  });
});
