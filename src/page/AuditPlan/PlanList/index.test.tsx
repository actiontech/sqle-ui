/* eslint-disable no-console */
import { act, fireEvent, screen } from '@testing-library/react';
import { useLocation, useParams } from 'react-router-dom';
import PlanList from '.';
import audit_plan from '../../../api/audit_plan';
import {
  getBySelector,
  getHrefByText,
  selectOptionByIndex,
} from '../../../testUtils/customQuery';
import { renderWithRouter } from '../../../testUtils/customRender';

import {
  mockDriver,
  mockUseAuditPlanTypes,
  mockUseInstance,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { mockUseStyle } from '../../../testUtils/mockStyle';
import { AuditPlanList } from './__testData__';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const projectName = 'default';

describe('PlanList', () => {
  let dispatchSpy = jest.fn();
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

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
    mockUseInstance();
    mockDriver();
    mockUseAuditPlanTypes();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        auditPlan: {
          modalStatus: {},
          selectAuditPlan: null,
        },
        user: {},
        projectManage: { archived: false },
      })
    );
    mockUseStyle();

    useParamsMock.mockReturnValue({ projectName });
    useLocationMock.mockReturnValue({
      pathname: '/auditPlan',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    useLocationMock.mockRestore();
  });

  afterAll(() => {
    console.error = consoleError;
  });

  const mockGetAuditPlan = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlansV2');
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
    await act(async () => jest.advanceTimersByTime(3000));

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

    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });

  test('should send remove audit plan request', async () => {
    const getAuditPlanSpy = mockGetAuditPlan();
    const deleteSpy = mockRemoveAuditPlan();
    renderWithRouter(<PlanList />);
    expect(getAuditPlanSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('common.more')[0]);

    await act(async () => jest.advanceTimersByTime(0));

    const allRemoveButton = screen.getAllByText('common.delete');
    fireEvent.click(allRemoveButton[0]);
    expect(screen.getByText('auditPlan.remove.confirm')).toBeInTheDocument();
    fireEvent.click(screen.getByText('OK'));
    expect(screen.getByText('auditPlan.remove.loading')).toBeInTheDocument();
    expect(deleteSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledWith({
      project_name: projectName,
      audit_plan_name: AuditPlanList[0].audit_plan_name,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('auditPlan.remove.successTips')
    ).toBeInTheDocument();
    expect(getAuditPlanSpy).toBeCalledTimes(2);
  });

  test('should open subscribe modal when user click subscribe notice button', async () => {
    const getAuditPlanSpy = mockGetAuditPlan();
    renderWithRouter(<PlanList />);
    expect(getAuditPlanSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('common.more')[0]);

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('auditPlan.list.operator.notice'));

    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).nthCalledWith(2, {
      payload: {
        audit_plan_cron: '0 */2 * * *',
        audit_plan_db_type: 'mysql',
        audit_plan_instance_database: 'sqle',
        audit_plan_instance_name: 'db1',
        rule_template: {
          is_global_rule_template: true,
          name: 'rule_template_name1',
        },
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

  test('should send request with filter params when user set filter info for table', async () => {
    const getAuditPlanSpy = mockGetAuditPlan();
    renderWithRouter(<PlanList />);
    expect(getAuditPlanSpy).toBeCalledTimes(1);
    expect(getAuditPlanSpy).toBeCalledWith({
      project_name: projectName,
      page_index: 1,
      page_size: 10,
    });
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

    selectOptionByIndex('auditPlan.list.table.audit_plan_db_type', 'mysql', -1);

    fireEvent.click(screen.getByText('common.search'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(getAuditPlanSpy).toBeCalledTimes(2);
    expect(getAuditPlanSpy).nthCalledWith(2, {
      page_index: 1,
      page_size: 10,
      filter_audit_plan_db_type: 'mysql',
      filter_audit_plan_instance_name: 'instance1',
      fuzzy_search_audit_plan_name: '123',
      filter_audit_plan_type: 'mysql_schema_meta',
      project_name: projectName,
    });

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.reset'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(getAuditPlanSpy).toBeCalledTimes(3);
    expect(getAuditPlanSpy).nthCalledWith(3, {
      project_name: projectName,
      page_index: 1,
      page_size: 10,
    });
  });

  test('should send request once when url include filter info', async () => {
    const getAuditPlanSpy = mockGetAuditPlan();
    useLocationMock.mockReturnValue({
      pathname: '/auditPlan',
      search: '?type=ali_rds_mysql_slow_log',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
    renderWithRouter(<PlanList />);
    await act(async () => jest.advanceTimersByTime(100));

    expect(getAuditPlanSpy).toBeCalledTimes(1);
    expect(getAuditPlanSpy).toBeCalledWith({
      project_name: projectName,
      page_index: 1,
      page_size: 10,
      filter_audit_plan_type: 'ali_rds_mysql_slow_log',
    });
  });

  test('should jump to next page when user click next page button', async () => {
    const getAuditPlanSpy = mockGetAuditPlan();

    getAuditPlanSpy.mockImplementation(() =>
      resolveThreeSecond(
        Array.from({ length: 11 }, (_, i) => ({
          ...AuditPlanList[0],
          audit_plan_name: `audit_plan_name_${i}`,
        })),
        { otherData: { total_nums: 11 } }
      )
    );

    renderWithRouter(<PlanList />);
    expect(getAuditPlanSpy).nthCalledWith(1, {
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.ant-pagination-next'));
    expect(getAuditPlanSpy).nthCalledWith(2, {
      page_index: 2,
      page_size: 10,
      project_name: projectName,
    });
    fireEvent.click(getBySelector('.ant-pagination-prev'));
    expect(getAuditPlanSpy).nthCalledWith(3, {
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
    expect(getAuditPlanSpy).toBeCalledTimes(3);
  });

  test('should render rule link when rule template name is not empty', async () => {
    renderWithRouter(<PlanList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getHrefByText(AuditPlanList[0].rule_template?.name!)).toBe(
      '/rule?ruleTemplateName=rule_template_name1'
    );
    expect(getHrefByText(AuditPlanList[1].rule_template?.name!)).toBe(
      '/rule?projectName=default&ruleTemplateName=rule_template_name2'
    );
  });

  test('should hide the Add, Edit feature when project is archived', async () => {
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        projectManage: { archived: true },
        user: {},
        auditPlan: {
          modalStatus: {},
          selectAuditPlan: null,
        },
      })
    );

    renderWithRouter(<PlanList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryAllByText('common.delete')[0]).toBeUndefined();
    expect(screen.queryAllByText('common.edit')[0]).toBeUndefined();
    expect(screen.queryAllByText('common.more')[0]).toBeUndefined();
    expect(
      screen.queryByText('auditPlan.action.create')
    ).not.toBeInTheDocument();
  });
});
