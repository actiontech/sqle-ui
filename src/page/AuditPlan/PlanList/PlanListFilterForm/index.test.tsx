import { act, fireEvent, render, screen } from '@testing-library/react';
import PlanListFilterForm from '.';
import {
  selectCustomOptionByClassName,
  selectOptionByIndex,
} from '../../../../testUtils/customQuery';
import {
  mockDriver,
  mockUseAuditPlanTypes,
  mockUseInstance,
} from '../../../../testUtils/mockRequest';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

const projectName = 'default';

describe('PlanListFilerForm', () => {
  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    useLocationMock.mockReturnValue({
      pathname: '/auditPlan',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
    mockUseInstance();
    mockDriver();
    mockUseAuditPlanTypes();
  });

  afterEach(() => {
    useLocationMock.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', async () => {
    const { container } = render(
      <PlanListFilterForm projectName={projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('should pass all fields when user click search button', async () => {
    const submitSpy = jest.fn();

    const { container } = render(
      <PlanListFilterForm submit={submitSpy} projectName={projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

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

    selectCustomOptionByClassName(
      'auditPlan.list.table.audit_plan_db_type',
      'database-type-logo-wrapper',
      -1
    );

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.search'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(submitSpy).toBeCalledTimes(2);
    expect(submitSpy).nthCalledWith(2, {
      filter_audit_plan_db_type: 'mysql',
      filter_audit_plan_instance_name: 'instance1',
      fuzzy_search_audit_plan_name: '123',
      filter_audit_plan_type: 'mysql_schema_meta',
    });

    fireEvent.click(screen.getByText('common.reset'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();

    expect(submitSpy).toBeCalledTimes(3);
    expect(submitSpy).nthCalledWith(3, {});
  });

  it('should set audit task type in filter form when url include type params', async () => {
    const submitSpy = jest.fn();
    useLocationMock.mockReturnValue({
      pathname: '/auditPlan',
      search: '?type=ali_rds_mysql_slow_log',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });

    const { container } = render(
      <PlanListFilterForm submit={submitSpy} projectName={projectName} />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(submitSpy).toBeCalledTimes(1);
    expect(submitSpy).toBeCalledWith({
      filter_audit_plan_type: 'ali_rds_mysql_slow_log',
    });
  });
});
