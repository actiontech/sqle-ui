import { render, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import AuditPlanReport from '.';
import audit_plan from '../../../../../api/audit_plan';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import { AuditReport } from '../../__testData__';
jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});
describe('AuditPlanReport', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({
      auditPlanName: 'auditPlanName1',
      reportId: '32',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetReport = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanReportSQLsV2');
    spy.mockImplementation(() =>
      resolveThreeSecond(AuditReport, { otherData: { total_nums: 63 } })
    );
    return spy;
  };

  test('should match snapshot', async () => {
    const getReportSpy = mockGetReport();
    const { container } = render(<AuditPlanReport />);
    expect(container).toMatchSnapshot();
    expect(getReportSpy).toBeCalledTimes(1);
    expect(getReportSpy).toBeCalledWith({
      audit_plan_name: 'auditPlanName1',
      audit_plan_report_id: '32',
      page_index: 1,
      page_size: 10,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
