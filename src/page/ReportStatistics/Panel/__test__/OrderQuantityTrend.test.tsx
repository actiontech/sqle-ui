/* eslint-disable no-console */
import { useTheme } from '@mui/styles';
import { act, fireEvent, render, screen } from '@testing-library/react';
import moment from 'moment';
import statistic from '../../../../api/statistic';
import { SupportLanguage } from '../../../../locale';
import { getAllBySelector } from '../../../../testUtils/customQuery';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../theme';
import OrderQuantityTrend from '../OrderQuantityTrend';
import mockRequestData from './mockRequestData';
import { useSelector } from 'react-redux';

jest.mock('@mui/styles', () => {
  return {
    ...jest.requireActual('@mui/styles'),
    useTheme: jest.fn(),
  };
});

const { OrderQuantityTrendData } = mockRequestData;
const dateFormat = 'YYYY-MM-DD';
const error = console.error;
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

describe('test OrderQuantityTrend', () => {
  const mockGetTaskCreatedCountEachDayV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowCreatedCountEachDayV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(OrderQuantityTrendData);
    });
    return spy;
  };

  const mockErrorGetTaskCreatedCountEachDayV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowCreatedCountEachDayV1');
    spy.mockImplementation(() => {
      return resolveErrorThreeSecond({});
    });
    return spy;
  };

  const useThemeMock: jest.Mock = useTheme as jest.Mock;
  let nowSpy: jest.SpyInstance;
  beforeAll(() => {
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });
  });
  afterAll(() => {
    console.error = error;
  });
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
        locale: { language: SupportLanguage.zhCN },
        reportStatistics: { refreshFlag: false },
      })
    );
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
    jest.useFakeTimers();
    nowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('2022-06-29').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    nowSpy.mockRestore();
  });
  test('should match snapshot', async () => {
    mockGetTaskCreatedCountEachDayV1();
    const { container } = render(<OrderQuantityTrend />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetTaskCreatedCountEachDayV1();
    const { container } = render(<OrderQuantityTrend />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowCreatedCountEachDayV1 with the default date when first rendered', async () => {
    const getTaskCreatedCountEachDayV1Spy = mockGetTaskCreatedCountEachDayV1();
    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(0);

    render(<OrderQuantityTrend />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(1);
    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledWith({
      filter_date_from: moment().subtract(30, 'days').format(dateFormat),
      filter_date_to: moment().format(dateFormat),
    });
  });

  test('should called getWorkflowCreatedCountEachDayV1 when the date has been modified', async () => {
    const getTaskCreatedCountEachDayV1Spy = mockGetTaskCreatedCountEachDayV1();
    render(<OrderQuantityTrend />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(1);

    const startDate = getAllBySelector(
      'input',
      screen.getByTestId('filterRangePicker')
    )[0];

    fireEvent.mouseDown(startDate);
    fireEvent.change(startDate, { target: { value: '2022-06-12' } });
    fireEvent.click(getAllBySelector('.ant-picker-cell-range-start')[0]);

    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(2);
    expect(getTaskCreatedCountEachDayV1Spy).nthCalledWith(2, {
      filter_date_from: '2022-06-12',
      filter_date_to: moment().format(dateFormat),
    });
  });
});
