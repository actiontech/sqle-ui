/* eslint-disable no-console */
import { useTheme } from '@mui/styles';
import { act, fireEvent, render, screen } from '@testing-library/react';
import statistic from '../../../../api/statistic';
import { SupportLanguage } from '../../../../locale';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../theme';
import OrderQuantityWithDbType from '../OrderQuantityWithDbType';
import mockRequestData from './mockRequestData';
import { useSelector } from 'react-redux';

jest.mock('@mui/styles', () => {
  return {
    ...jest.requireActual('@mui/styles'),
    useTheme: jest.fn(),
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

const { OrderQuantityWithDbTypeData } = mockRequestData;
const error = console.error;

describe('test OrderQuantityWithDbType', () => {
  const mockGetTasksPercentCountedByInstanceTypeV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowPercentCountedByInstanceTypeV1'
    );
    spy.mockImplementation(() => {
      return resolveThreeSecond(OrderQuantityWithDbTypeData);
    });
    return spy;
  };

  const mockErrorGetTasksPercentCountedByInstanceTypeV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowPercentCountedByInstanceTypeV1'
    );
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

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
        locale: { language: SupportLanguage.zhCN },
        reportStatistics: { refreshFlag: false },
      })
    );
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    console.error = error;
  });
  test('should match snapshot', async () => {
    mockGetTasksPercentCountedByInstanceTypeV1();
    const { baseElement } = render(<OrderQuantityWithDbType />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseEnter(screen.getByTestId('order-db-type-scale-tips'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetTasksPercentCountedByInstanceTypeV1();
    const { container } = render(<OrderQuantityWithDbType />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowPercentCountedByInstanceTypeV1 when first rendered', async () => {
    const getTasksPercentCountedByInstanceTypeV1Spy =
      mockGetTasksPercentCountedByInstanceTypeV1();
    render(<OrderQuantityWithDbType />);
    expect(getTasksPercentCountedByInstanceTypeV1Spy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
