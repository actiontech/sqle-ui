import { useTheme } from '@material-ui/styles';
import { render, waitFor } from '@testing-library/react';
import statistic from '../../../api/statistic';
import { SupportLanguage } from '../../../locale';
import { mockUseSelector } from '../../../testUtils/mockRedux';
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

describe('test ReportStatistics', () => {
  const mockGetTaskRejectedPercentGroupByInstanceV1 = () => {
    const spy = jest.spyOn(
      statistic,
      'getTaskRejectedPercentGroupByInstanceV1'
    );
    spy.mockImplementation(() => {
      return resolveThreeSecond(DiffInstanceOrderRejectedPercentData);
    });
    return spy;
  };
  const mockGetTaskRejectedPercentGroupByCreatorV1 = () => {
    const spy = jest.spyOn(statistic, 'getTaskRejectedPercentGroupByCreatorV1');
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
    const spy = jest.spyOn(statistic, 'getTaskDurationOfWaitingForExecutionV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(OrderAverageExecuteTimeData)
    );
    return spy;
  };
  const mockGetTaskDurationOfWaitingForAuditV1 = () => {
    const spy = jest.spyOn(statistic, 'getTaskDurationOfWaitingForAuditV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(OrderAverageReviewTimeData)
    );
    return spy;
  };
  const mockGetTaskPassPercentV1 = () => {
    const spy = jest.spyOn(statistic, 'getTaskPassPercentV1');
    spy.mockImplementation(() => resolveThreeSecond(OrderPassPercentData));
    return spy;
  };
  const mockGetTaskCreatedCountEachDayV1 = () => {
    const spy = jest.spyOn(statistic, 'getTaskCreatedCountEachDayV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(OrderQuantityTrendData);
    });
    return spy;
  };
  const mockGetTasksPercentCountedByInstanceTypeV1 = () => {
    const spy = jest.spyOn(statistic, 'getTasksPercentCountedByInstanceTypeV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(OrderQuantityWithDbTypeData);
    });
    return spy;
  };
  const mockGetTaskStatusCountV1 = () => {
    const spy = jest.spyOn(statistic, 'getTaskStatusCountV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(OrderStatusData);
    });
    return spy;
  };
  const mockGetTaskCountV1 = () => {
    const spy = jest.spyOn(statistic, 'getTaskCountV1');
    spy.mockImplementation(() => resolveThreeSecond(OrderTotalNumbersData));
    return spy;
  };
  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  beforeEach(() => {
    mockGetTaskCountV1();
    mockGetTaskStatusCountV1();
    mockGetTasksPercentCountedByInstanceTypeV1();
    mockGetTaskCreatedCountEachDayV1();
    mockGetTaskPassPercentV1();
    mockGetTaskDurationOfWaitingForAuditV1();
    mockGetTaskDurationOfWaitingForExecutionV1();
    mockGetLicenseUsageV1();
    mockGetInstancesTypePercentV1();
    mockGetTaskRejectedPercentGroupByCreatorV1();
    mockGetTaskRejectedPercentGroupByInstanceV1();
    jest.useFakeTimers();
    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
    });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { container } = render(<ReportStatistics />);
    expect(container).toMatchSnapshot();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });
});
