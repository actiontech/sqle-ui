import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import AuditPlanReport from '.';
import audit_plan from '../../../../../api/audit_plan';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import { mockGetAllRules } from '../../../../Rule/__test__/utils';
import { AuditPlanReportList, AuditReport } from '../../__testData__';
jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});
describe('AuditPlanReport', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const projectName = 'default';
  let getAllRulesSpy: jest.SpyInstance;
  beforeEach(() => {
    getAllRulesSpy = mockGetAllRules();
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({
      auditPlanName: 'auditPlanName1',
      reportId: '32',
      projectName,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetReport = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanReportsSQLs');
    spy.mockImplementation(() =>
      resolveThreeSecond(AuditReport, { otherData: { total_nums: 63 } })
    );
    return spy;
  };

  const mockGetReportInfo = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanReportV1');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlanReportList[0]));
    return spy;
  };

  test('should match snapshot', async () => {
    const getReportSpy = mockGetReport();
    const getReportInfoSpy = mockGetReportInfo();
    const { container } = render(<AuditPlanReport />);
    expect(container).toMatchSnapshot();
    expect(getReportInfoSpy).toBeCalledTimes(1);
    expect(getReportInfoSpy).toBeCalledWith({
      project_name: projectName,
      audit_plan_name: 'auditPlanName1',
      audit_plan_report_id: '32',
    });
    expect(getReportSpy).toBeCalledTimes(1);
    expect(getReportSpy).toBeCalledWith({
      project_name: projectName,
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

  test('should jump to analyze page when user click analyze button', async () => {
    mockGetReport();
    mockGetReportInfo();
    render(<AuditPlanReport />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    const openSpy = jest.spyOn(window, 'open');
    openSpy.mockImplementationOnce(() => null);
    fireEvent.click(screen.getAllByText('auditPlan.report.table.analyze')[0]);
    expect(openSpy).toBeCalledTimes(1);
    expect(openSpy).toBeCalledWith(
      '/project/default/auditPlan/32/0/auditPlanName1/analyze'
    );
    openSpy.mockRestore();
  });

  test('should call get all rules request', async () => {
    mockGetReport();
    mockGetReportInfo();
    render(<AuditPlanReport />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getAllRulesSpy).toBeCalledTimes(AuditReport.length);
  });
});
