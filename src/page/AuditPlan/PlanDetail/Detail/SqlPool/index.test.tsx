import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import SqlPool from '.';
import audit_plan from '../../../../../api/audit_plan';
import EmitterKey from '../../../../../data/EmitterKey';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';
import { AuditPlanSqls } from '../../__testData__';

describe('SqlPool', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetSqls();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetSqls = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanSQLsV1');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlanSqls));
    return spy;
  };

  const mockTrigger = () => {
    const spy = jest.spyOn(audit_plan, 'triggerAuditPlanV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = render(<SqlPool auditPlanName="planName" />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should trigger audit plan', async () => {
    const triggerSpy = mockTrigger();
    render(<SqlPool auditPlanName="planName" />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('auditPlan.sqlPool.action.trigger'));
    expect(triggerSpy).toBeCalledTimes(1);
    expect(triggerSpy).toBeCalledWith({ audit_plan_name: 'planName' });
    expect(
      screen.queryByText('auditPlan.sqlPool.action.loading')
    ).toBeInTheDocument();
    const jestSpy = jest.spyOn(EventEmitter, 'emit');

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('auditPlan.sqlPool.action.loading')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('auditPlan.sqlPool.action.triggerSuccess')
    ).toBeInTheDocument();
    expect(jestSpy).toBeCalledTimes(1);
    expect(jestSpy).toBeCalledWith(EmitterKey.Refresh_Audit_Plan_Record);
  });
});
