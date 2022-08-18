/* eslint-disable no-console */
import { fireEvent, screen, waitFor } from '@testing-library/react';
import PlanList from '.';
import audit_plan from '../../../api/audit_plan';
import { renderWithRouter } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { mockUseStyle } from '../../../testUtils/mockStyle';
import { AuditPlanList } from './__testData__';

describe('PlanList', () => {
  let dispatchSpy!: jest.SpyInstance;

  let consoleError: any;
  beforeAll(() => {
    consoleError = console.error;
    console.error = (...args: any[]) => {
      if (
        args[0].includes(
          `\`children\` is array of render props cannot have \`name\``
        )
      ) {
        return;
      }
      consoleError(...args);
    };
  });

  beforeEach(() => {
    jest.useFakeTimers();
    mockGetAuditPlan();
    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseStyle();
    mockUseSelector({
      auditPlan: {
        modalStatus: {},
        selectAuditPlan: null,
      },
      user: {},
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    console.error = consoleError;
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
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalStatus: {
          SUBSCRIBE_NOTICE: false,
        },
      },
      type: 'auditPlan/initModalStatus',
    });

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('common.more')[0]);

    await waitFor(() => {
      jest.advanceTimersByTime(0);
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

    fireEvent.click(screen.getAllByText('common.more')[0]);

    await waitFor(() => {
      jest.advanceTimersByTime(0);
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

  test('should open subscribe modal when user click subscribe notice button', async () => {
    const getAuditPlanSpy = mockGetAuditPlan();
    renderWithRouter(<PlanList />);
    expect(getAuditPlanSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getAllByText('common.more')[0]);

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getByText('auditPlan.list.operator.notice'));

    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).nthCalledWith(2, {
      payload: {
        audit_plan_cron: '0 */2 * * *',
        audit_plan_db_type: 'mysql',
        audit_plan_instance_database: 'sqle',
        audit_plan_instance_name: 'db1',
        rule_template_name: 'rule_template_name1',
        audit_plan_meta: {
          audit_plan_params: [],
          audit_plan_type: 'audit_for_java_app',
          audit_plan_type_desc: '审核java应用',
          instance_type: 'mysql',
        },
        audit_plan_name: 'audit_for_java_app11',
        audit_plan_token:
          'wkpjrnbuneufaljqxijggisjedhpwlhippscklduloxbgymgvwkvhuurmyjiqbaiufvadmkncenueesmbqjqeudkbqdhvihiwzrsdrqbluhashusgzemonxivbsrz',
      },
      type: 'auditPlan/updateSelectAuditPlan',
    });
    expect(dispatchSpy).nthCalledWith(3, {
      payload: { modalName: 'SUBSCRIBE_NOTICE', status: true },
      type: 'auditPlan/updateModalStatus',
    });
  });
});
