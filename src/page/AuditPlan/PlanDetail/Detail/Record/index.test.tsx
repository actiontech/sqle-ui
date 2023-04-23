import { act } from '@testing-library/react';
import PlanAuditRecord from '.';
import audit_plan from '../../../../../api/audit_plan';
import EmitterKey from '../../../../../data/EmitterKey';
import { renderWithRouter } from '../../../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';
import { AuditPlanReportList } from '../../__testData__';

describe('AuditPlanRecord', () => {
  const projectName = 'default';
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAuditPlanReport = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanReportsV1');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlanReportList));
    return spy;
  };

  test('should match snapshot', async () => {
    const getReportSpy = mockGetAuditPlanReport();
    const { container } = renderWithRouter(
      <PlanAuditRecord auditPlanName="planName" projectName={projectName} />
    );
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(getReportSpy).toBeCalledTimes(1);
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Audit_Plan_Record);
    });
    expect(getReportSpy).toBeCalledTimes(2);
  });
});
