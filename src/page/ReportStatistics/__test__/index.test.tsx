/* eslint-disable no-console */
import { useTheme } from '@mui/styles';
import { act, fireEvent, screen } from '@testing-library/react';
import statistic from '../../../api/statistic';
import { SupportLanguage } from '../../../locale';
import { renderWithRedux } from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { SupportTheme } from '../../../theme';
import ReportStatistics from '../index';
import mockRequestData from '../Panel/__test__/mockRequestData';
import { useDispatch, useSelector } from 'react-redux';

const {
  DiffUserOrderRejectedPercentData,
  InstanceProportionWithDbTypeData,
  LicenseUsageData,
  OrderAverageReviewTimeData,
  OrderPassPercentData,
  OrderQuantityTrendData,
  OrderQuantityWithDbTypeData,
  OrderStatusData,
  OrderTotalNumbersData,
  SqlExecFailedTopNData,
  SqlAverageExecutionTimeData,
} = mockRequestData;

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
    useDispatch: jest.fn(),
  };
});

describe('test ReportStatistics', () => {
  const scopeDispatch = jest.fn();

  const mockGetTaskRejectedPercentGroupByCreatorV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowRejectedPercentGroupByCreatorV1'
    );
    spy.mockImplementation(() => {
      return resolveThreeSecond(DiffUserOrderRejectedPercentData);
    });
    return spy;
  };
  const mockGetInstancesTypePercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getInstancesTypePercentV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(InstanceProportionWithDbTypeData);
    });
    return spy;
  };
  const mockGetLicenseUsageV1 = () => {
    const spy = jest.spyOn(statistic, 'getLicenseUsageV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(LicenseUsageData);
    });
    return spy;
  };

  const mockGetTaskDurationOfWaitingForAuditV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowDurationOfWaitingForAuditV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(OrderAverageReviewTimeData)
    );
    return spy;
  };
  const mockGetTaskPassPercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowAuditPassPercentV1');
    spy.mockImplementation(() => resolveThreeSecond(OrderPassPercentData));
    return spy;
  };
  const mockGetTaskCreatedCountEachDayV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowCreatedCountEachDayV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(OrderQuantityTrendData);
    });
    return spy;
  };
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
  const mockGetTaskStatusCountV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowStatusCountV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(OrderStatusData);
    });
    return spy;
  };
  const mockGetTaskCountV1 = () => {
    const spy = jest.spyOn(statistic, 'getWorkflowCountV1');
    spy.mockImplementation(() => resolveThreeSecond(OrderTotalNumbersData));
    return spy;
  };

  const mockGetSqlExecutionFailPercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getSqlExecutionFailPercentV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(SqlExecFailedTopNData);
    });
    return spy;
  };

  const mockGetSqlAverageExecutionTimeV1 = () => {
    const spy = jest.spyOn(statistic, 'getSqlAverageExecutionTimeV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(SqlAverageExecutionTimeData);
    });
    return spy;
  };

  const useThemeMock: jest.Mock = useTheme as jest.Mock;
  const error = console.error;
  let nowSpy: jest.SpyInstance;

  let getTaskCountV1Spy: jest.SpyInstance;
  let getTaskStatusCountV1Spy: jest.SpyInstance;
  let getTasksPercentCountedByInstanceTypeV1Spy: jest.SpyInstance;
  let getTaskCreatedCountEachDayV1Spy: jest.SpyInstance;
  let getTaskPassPercentV1Spy: jest.SpyInstance;
  let getTaskDurationOfWaitingForAuditV1Spy: jest.SpyInstance;
  let getLicenseUsageV1Spy: jest.SpyInstance;
  let getInstancesTypePercentV1Spy: jest.SpyInstance;
  let getTaskRejectedPercentGroupByCreatorV1Spy: jest.SpyInstance;
  let getSqlExecutionFailPercentV1Spy: jest.SpyInstance;
  let getSqlAverageExecutionTimeV1Spy: jest.SpyInstance;
  beforeEach(() => {
    console.error = jest.fn((message: any) => {
      if (
        message.includes('React does not recognize the') ||
        message.includes('Invalid value for prop')
      ) {
        return;
      }
      error(message);
    });

    const dateNowStub = jest.fn(() => new Date('2022-08-11T12:33:37.000Z'));
    global.Date.now = dateNowStub as any;

    getTaskCountV1Spy = mockGetTaskCountV1();
    getTaskStatusCountV1Spy = mockGetTaskStatusCountV1();
    getTasksPercentCountedByInstanceTypeV1Spy =
      mockGetTasksPercentCountedByInstanceTypeV1();
    getTaskCreatedCountEachDayV1Spy = mockGetTaskCreatedCountEachDayV1();
    getTaskPassPercentV1Spy = mockGetTaskPassPercentV1();
    getTaskDurationOfWaitingForAuditV1Spy =
      mockGetTaskDurationOfWaitingForAuditV1();
    getLicenseUsageV1Spy = mockGetLicenseUsageV1();
    getInstancesTypePercentV1Spy = mockGetInstancesTypePercentV1();
    getTaskRejectedPercentGroupByCreatorV1Spy =
      mockGetTaskRejectedPercentGroupByCreatorV1();
    getSqlExecutionFailPercentV1Spy = mockGetSqlExecutionFailPercentV1();
    getSqlAverageExecutionTimeV1Spy = mockGetSqlAverageExecutionTimeV1();
    jest.useFakeTimers();

    useThemeMock.mockReturnValue({ common: { padding: 24 } });

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
        locale: { language: SupportLanguage.zhCN },
        reportStatistics: { refreshFlag: false },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    nowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('2022-06-29').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    scopeDispatch.mockClear();
    console.error = error;
    nowSpy.mockRestore();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithRedux(<ReportStatistics />);
    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should called request when clicking refresh button', async () => {
    renderWithRedux(<ReportStatistics />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getTaskCountV1Spy).toBeCalledTimes(1);
    expect(getTaskStatusCountV1Spy).toBeCalledTimes(1);
    expect(getTasksPercentCountedByInstanceTypeV1Spy).toBeCalledTimes(1);
    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(1);
    expect(getTaskPassPercentV1Spy).toBeCalledTimes(1);
    expect(getTaskDurationOfWaitingForAuditV1Spy).toBeCalledTimes(1);
    expect(getLicenseUsageV1Spy).toBeCalledTimes(1);
    expect(getInstancesTypePercentV1Spy).toBeCalledTimes(1);
    expect(getTaskRejectedPercentGroupByCreatorV1Spy).toBeCalledTimes(1);
    expect(getSqlExecutionFailPercentV1Spy).toBeCalledTimes(1);
    expect(getSqlAverageExecutionTimeV1Spy).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId('refreshReportStatistics'));
    expect(scopeDispatch).toBeCalledTimes(1);
    expect(scopeDispatch).toBeCalledWith({
      payload: undefined,
      type: 'reportStatistics/refreshReportStatistics',
    });
  });
});
