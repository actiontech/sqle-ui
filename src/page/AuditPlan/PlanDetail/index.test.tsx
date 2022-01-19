import { shallow } from 'enzyme';
import PlanDetail from '.';
import toJSON from 'enzyme-to-json';
import { useParams } from 'react-router-dom';
import audit_plan from '../../../api/audit_plan';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { AuditPlan } from '../PlanList/__testData__';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

describe('PlanDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  beforeEach(() => {
    useParamsMock.mockReturnValue({ auditPlanName: 'plan name' });
    jest.useFakeTimers();
    mockGetAuditPlanV1();
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

  test('should match snapshot', async () => {
    const wrapper = shallow(<PlanDetail />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('should send request for get audit plan detail', () => {
    const spy = mockGetAuditPlanV1();
    renderWithThemeAndRouter(<PlanDetail />);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({ audit_plan_name: 'plan name' });
  });
});
