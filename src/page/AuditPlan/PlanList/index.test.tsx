import { fireEvent, screen, waitFor } from '@testing-library/react';
import PlanList from '.';
import audit_plan from '../../../api/audit_plan';
import { renderWithRouter } from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { AuditPlanList } from './__testData__';

describe('PlanList', () => {
  beforeEach(() => {
    mockGetAuditPlan();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAuditPlan = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlansV1');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlanList));
    return spy;
  };

  const mockRemoveAuditPlan = () => {
    const spy = jest.spyOn(audit_plan, 'deleteAuditPlanV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = renderWithRouter(<PlanList />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should send remove audit plan request', async () => {
    const getAuditPlanSpy = mockGetAuditPlan();
    const deleteSpy = mockRemoveAuditPlan();
    renderWithRouter(<PlanList />);
    expect(getAuditPlanSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    const allRemoveButton = screen.getAllByText('common.delete');
    fireEvent.click(allRemoveButton[0]);
    expect(screen.queryByText('auditPlan.remove.confirm')).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(screen.queryByText('auditPlan.remove.loading')).toBeInTheDocument();
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({
      audit_plan_name: AuditPlanList[0].audit_plan_name,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('auditPlan.remove.successTips')
    ).toBeInTheDocument();
    expect(getAuditPlanSpy).toBeCalledTimes(2);
  });
});
