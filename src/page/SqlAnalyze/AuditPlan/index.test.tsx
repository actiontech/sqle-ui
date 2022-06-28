import { fireEvent, render, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import AuditPlanSqlAnalyze from '.';
import audit_plan from '../../../api/audit_plan';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { AuditPlanSqlAnalyzeData } from '../__testData__';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

describe('SqlAnalyze/AuditPlan', () => {
  // eslint-disable-next-line no-console
  const error = console.error;

  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // eslint-disable-next-line no-console
    (console.error as any).mockImplementation((message: any) => {
      if (
        message.includes('Each child in a list should have a unique "key" prop')
      ) {
        return;
      }
      error(message);
    });
  });

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ reportId: 'reportId1', sqlNum: '123' });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error = error;
  });

  const mockGetAnalyzeData = () => {
    const spy = jest.spyOn(audit_plan, 'getTaskAnalysisData');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlanSqlAnalyzeData));
    return spy;
  };

  test('should get analyze data from origin', async () => {
    const spy = mockGetAnalyzeData();
    const { container } = render(<AuditPlanSqlAnalyze />);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({
      audit_plan_report_id: 'reportId1',
      number: '123',
    });
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(container.querySelectorAll('.ant-tabs-tab-btn')[1]);
    fireEvent.click(container.querySelectorAll('.ant-tabs-tab-btn')[2]);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(container).toMatchSnapshot();
  });

  test('should render error result of type "info" when response code is 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(AuditPlanSqlAnalyzeData, {
        otherData: {
          code: 8001,
        },
      })
    );
    const { container } = render(<AuditPlanSqlAnalyze />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
