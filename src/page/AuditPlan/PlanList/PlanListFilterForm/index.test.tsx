import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PlanListFilterForm from '.';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import {
  mockDriver,
  mockUseAuditPlanTypes,
  mockUseInstance,
} from '../../../../testUtils/mockRequest';

describe('PlanListFilerForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseInstance();
    mockDriver();
    mockUseAuditPlanTypes();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', async () => {
    const { container } = render(<PlanListFilterForm />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  it('should pass all fields when user click search button', async () => {
    const submitSpy = jest.fn();

    const { container } = render(<PlanListFilterForm submit={submitSpy} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(
      screen.getByLabelText('auditPlan.list.table.audit_plan_name'),
      { target: { value: '123' } }
    );

    selectOptionByIndex(
      'auditPlan.list.table.audit_plan_instance_name',
      'instance1',
      1
    );

    selectOptionByIndex(
      'auditPlan.list.table.audit_plan_type',
      '库表元数据',
      0
    );

    selectOptionByIndex('auditPlan.list.table.audit_plan_db_type', 'mysql', -1);

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(submitSpy).toBeCalledTimes(1);
    expect(submitSpy).toBeCalledWith({
      filter_audit_plan_db_type: 'mysql',
      filter_audit_plan_instance_name: 'instance1',
      filter_audit_plan_name: '123',
      filter_audit_plan_type: 'mysql_schema_meta',
    });

    fireEvent.click(screen.getByText('common.reset'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(container).toMatchSnapshot();

    expect(submitSpy).toBeCalledTimes(2);
    expect(submitSpy).nthCalledWith(2, {});
  });
});
