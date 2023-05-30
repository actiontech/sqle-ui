import { shallow } from 'enzyme';
import PlanDetail from '.';
import toJSON from 'enzyme-to-json';
import { useParams } from 'react-router-dom';
import audit_plan from '../../../api/audit_plan';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { AuditPlan } from '../PlanList/__testData__';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { AuditPlanReportList } from './__testData__';
import { useSelector } from 'react-redux';
import { mockGetAllRules } from '../../Rule/__test__/utils';
import { useTheme } from '@mui/styles';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

jest.mock('@mui/styles', () => {
  return {
    ...jest.requireActual('@mui/styles'),
    useTheme: jest.fn(),
  };
});

describe('PlanDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const projectName = 'default';
  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  beforeEach(() => {
    useParamsMock.mockReturnValue({ auditPlanName: 'plan name', projectName });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
    jest.useFakeTimers();
    mockGetAllRules();
    mockGetAuditPlanV1();
    mockGetAuditPlanReport();
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        projectManage: { archived: false },
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAuditPlanV1 = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanV1');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlan));
    return spy;
  };

  const mockGetAuditPlanReport = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanReportsV1');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlanReportList));
    return spy;
  };

  test('should match snapshot', async () => {
    const wrapper = shallow(<PlanDetail />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('should send request for get audit plan detail', async () => {
    const spy = mockGetAuditPlanV1();
    renderWithThemeAndRouter(<PlanDetail />, undefined, {
      initialEntries: [`/project/${projectName}/auditPlan/detail/test1`],
    });
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({
      audit_plan_name: 'plan name',
      project_name: projectName,
    });
  });
});
