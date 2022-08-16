import { useTheme } from '@material-ui/styles';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import statistic from '../../../api/statistic';
import { SupportLanguage } from '../../../locale';
import { renderWithRedux } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { SupportTheme } from '../../../theme';
import ReportStatistics from '../index';
import mockRequestData from '../Panel/__test__/mockRequestData';

const {
  DiffInstanceOrderRejectedPercentData,
  DiffUserOrderRejectedPercentData,
  InstanceProportionWithDbTypeData,
  LicenseUsageData,
  OrderAverageExecuteTimeData,
  OrderAverageReviewTimeData,
  OrderPassPercentData,
  OrderQuantityTrendData,
  OrderQuantityWithDbTypeData,
  OrderStatusData,
  OrderTotalNumbersData,
} = mockRequestData;

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: jest.fn(),
  };
});

describe.skip('test ReportStatistics', () => {
  let scopeDispatch: jest.Mock;

  const mockGetTaskRejectedPercentGroupByInstanceV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowRejectedPercentGroupByInstanceV1'
    );
    spy.mockImplementation(() => {
      return resolveThreeSecond(DiffInstanceOrderRejectedPercentData);
    });
    return spy;
  };
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
  const mockGetTaskDurationOfWaitingForExecutionV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getWorkflowDurationOfWaitingForExecutionV1'
    );
    spy.mockImplementation(() =>
      resolveThreeSecond(OrderAverageExecuteTimeData)
    );
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
    const spy = jest.spyOn(statistic, 'getWorkflowPassPercentV1');
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
  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  let getTaskCountV1Spy: jest.SpyInstance;
  let getTaskStatusCountV1Spy: jest.SpyInstance;
  let getTasksPercentCountedByInstanceTypeV1Spy: jest.SpyInstance;
  let getTaskCreatedCountEachDayV1Spy: jest.SpyInstance;
  let getTaskPassPercentV1Spy: jest.SpyInstance;
  let getTaskDurationOfWaitingForAuditV1Spy: jest.SpyInstance;
  let getTaskDurationOfWaitingForExecutionV1Spy: jest.SpyInstance;
  let getLicenseUsageV1Spy: jest.SpyInstance;
  let getInstancesTypePercentV1Spy: jest.SpyInstance;
  let getTaskRejectedPercentGroupByCreatorV1Spy: jest.SpyInstance;
  let getTaskRejectedPercentGroupByInstanceV1Spy: jest.SpyInstance;
  beforeEach(() => {
    getTaskCountV1Spy = mockGetTaskCountV1();
    getTaskStatusCountV1Spy = mockGetTaskStatusCountV1();
    getTasksPercentCountedByInstanceTypeV1Spy =
      mockGetTasksPercentCountedByInstanceTypeV1();
    getTaskCreatedCountEachDayV1Spy = mockGetTaskCreatedCountEachDayV1();
    getTaskPassPercentV1Spy = mockGetTaskPassPercentV1();
    getTaskDurationOfWaitingForAuditV1Spy =
      mockGetTaskDurationOfWaitingForAuditV1();
    getTaskDurationOfWaitingForExecutionV1Spy =
      mockGetTaskDurationOfWaitingForExecutionV1();
    getLicenseUsageV1Spy = mockGetLicenseUsageV1();
    getInstancesTypePercentV1Spy = mockGetInstancesTypePercentV1();
    getTaskRejectedPercentGroupByCreatorV1Spy =
      mockGetTaskRejectedPercentGroupByCreatorV1();
    getTaskRejectedPercentGroupByInstanceV1Spy =
      mockGetTaskRejectedPercentGroupByInstanceV1();
    jest.useFakeTimers();
    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
      reportStatistics: { refreshFlag: false },
    });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
    scopeDispatch = mockUseDispatch().scopeDispatch;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    scopeDispatch.mockClear();
  });

  test.skip('should match snapshot', async () => {
    const { container } = renderWithRedux(<ReportStatistics />);
    expect(container).toMatchSnapshot();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });

  test('should called request when clicking refresh button', async () => {
    renderWithRedux(<ReportStatistics />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskCountV1Spy).toBeCalledTimes(1);
    expect(getTaskStatusCountV1Spy).toBeCalledTimes(1);
    expect(getTasksPercentCountedByInstanceTypeV1Spy).toBeCalledTimes(1);
    expect(getTaskCreatedCountEachDayV1Spy).toBeCalledTimes(1);
    expect(getTaskPassPercentV1Spy).toBeCalledTimes(1);
    expect(getTaskDurationOfWaitingForAuditV1Spy).toBeCalledTimes(1);
    expect(getTaskDurationOfWaitingForExecutionV1Spy).toBeCalledTimes(1);
    expect(getLicenseUsageV1Spy).toBeCalledTimes(1);
    expect(getInstancesTypePercentV1Spy).toBeCalledTimes(1);
    expect(getTaskRejectedPercentGroupByCreatorV1Spy).toBeCalledTimes(1);
    expect(getTaskRejectedPercentGroupByInstanceV1Spy).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId('refreshReportStatistics'));
    expect(scopeDispatch).toBeCalledTimes(1);
    expect(scopeDispatch).toBeCalledWith({
      payload: undefined,
      type: 'reportStatistics/refreshReportStatistics',
    });
  });
});
