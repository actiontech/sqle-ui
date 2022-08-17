/* eslint-disable no-console */
import { useTheme } from '@material-ui/styles';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import moment from 'moment';
import statistic from '../../../../api/statistic';
import { SupportLanguage } from '../../../../locale';
import {
  getAllBySelector,
  getBySelector,
} from '../../../../testUtils/customQuery';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../theme';
import OrderQuantityTrend from '../OrderQuantityTrend';
import mockRequestData from './mockRequestData';

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: jest.fn(),
  };
});

const { OrderQuantityTrendData } = mockRequestData;
const dateFormat = 'YYYY-MM-DD';
const error = console.error;

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
  const realDateNow = Date.now.bind(global.Date);

  beforeEach(() => {
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });
    const dateNowStub = jest.fn(() => new Date('2022-08-11T12:33:37.000Z'));
    global.Date.now = dateNowStub as any;
    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
      reportStatistics: { refreshFlag: false },
    });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    global.Date.now = realDateNow;
    console.error = error;
  });
  test('should match snapshot', async () => {
    mockGetTaskCreatedCountEachDayV1();
    const { container } = render(<OrderQuantityTrend />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetTaskCreatedCountEachDayV1();
    const { container } = render(<OrderQuantityTrend />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });

  test('should called getWorkflowCreatedCountEachDayV1 with the default date when first rendered', async () => {
    const getTaskCreatedCountEachDayV1Spy = mockGetTaskCreatedCountEachDayV1();
    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(0);

    render(<OrderQuantityTrend />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(1);
    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledWith({
      filter_date_from: moment().subtract(30, 'days').format(dateFormat),
      filter_date_to: moment().format(dateFormat),
    });
  });

  test('should called getWorkflowCreatedCountEachDayV1 when the date has been modified', async () => {
    const getTaskCreatedCountEachDayV1Spy = mockGetTaskCreatedCountEachDayV1();
    render(<OrderQuantityTrend />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(1);

    const startDate = getAllBySelector(
      'input',
      screen.getByTestId('filterRangePicker')
    )[0];

    fireEvent.mouseDown(startDate);
    fireEvent.change(startDate, { target: { value: '2022-07-02' } });
    fireEvent.click(getBySelector('.ant-picker-cell-selected'));
    fireEvent.mouseDown(startDate);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(2);
    expect(getTaskCreatedCountEachDayV1Spy.mock.calls[1][0]).toEqual({
      filter_date_from: '2022-07-02',
      filter_date_to: moment().format(dateFormat),
    });

    const endDate = getAllBySelector(
      'input',
      screen.getByTestId('filterRangePicker')
    )[1];

    fireEvent.mouseDown(endDate);
    fireEvent.change(endDate, { target: { value: '2022-08-02' } });
    fireEvent.click(getBySelector('.ant-picker-cell-selected'));
    fireEvent.mouseDown(endDate);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(3);
    expect(getTaskCreatedCountEachDayV1Spy.mock.calls[2][0]).toEqual({
      filter_date_from: '2022-07-02',
      filter_date_to: '2022-08-02',
    });
  });
});
