/* eslint-disable no-console */
import { render, screen, fireEvent, act } from '@testing-library/react';
import SqlPool from '.';
import audit_plan from '../../../../../api/audit_plan';
import EmitterKey from '../../../../../data/EmitterKey';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';
import { AuditPlanSqlsRes } from '../../__testData__';

describe('SqlPool', () => {
  const error = console.error;
  const projectName = 'default';
  beforeAll(() => {
    console.error = jest.fn();
    (console.error as any).mockImplementation((message: any) => {
      if (
        message.includes('Each child in a list should have a unique "key" prop')
      ) {
        return;
      }
      error(message);
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
    mockGetSqls();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    console.error = error;
  });

  const mockGetSqls = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanSQLsV1');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlanSqlsRes));
    return spy;
  };

  const mockTrigger = () => {
    const spy = jest.spyOn(audit_plan, 'triggerAuditPlanV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = render(
      <SqlPool
        auditPlanName="planName"
        projectName={projectName}
        projectIsArchive={false}
      />
    );
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  test('should trigger audit plan', async () => {
    const triggerSpy = mockTrigger();
    render(
      <SqlPool
        auditPlanName="planName"
        projectName={projectName}
        projectIsArchive={false}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('auditPlan.sqlPool.action.trigger'));
    expect(triggerSpy).toBeCalledTimes(1);
    expect(triggerSpy).toBeCalledWith({
      audit_plan_name: 'planName',
      project_name: projectName,
    });
    expect(
      screen.getByText('auditPlan.sqlPool.action.loading')
    ).toBeInTheDocument();
    const jestSpy = jest.spyOn(EventEmitter, 'emit');

    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('auditPlan.sqlPool.action.loading')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('auditPlan.sqlPool.action.triggerSuccess')
    ).toBeInTheDocument();
    expect(jestSpy).toBeCalledTimes(1);
    expect(jestSpy).toBeCalledWith(EmitterKey.Refresh_Audit_Plan_Record);
  });

  test('should hide trigger button when "projectIsArchive" is equal true', async () => {
    render(
      <SqlPool
        auditPlanName="planName"
        projectName={projectName}
        projectIsArchive={true}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('auditPlan.sqlPool.action.trigger')
    ).not.toBeInTheDocument();
  });
});
