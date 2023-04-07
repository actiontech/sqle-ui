import { useHistory, useParams } from 'react-router-dom';
import PlanDetail from '.';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { useTheme } from '@material-ui/styles';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import { mockGetAllRules } from '../../../Rule/__test__/utils';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
    useHistory: jest.fn(),
  };
});

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: jest.fn(),
  };
});

describe('PlanDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const useHistoryMock: jest.Mock = useHistory as jest.Mock;
  const useThemeMock: jest.Mock = useTheme as jest.Mock;
  beforeEach(() => {
    useParamsMock.mockReturnValue({
      auditPlanName: 'auditPlanName1',
    });
    useHistoryMock.mockReturnValue({ location: { pathname: '/' } });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
    mockUseSelector({
      projectManage: { archived: false },
    });
    mockGetAllRules();
  });

  test('should should match snapshot without report', () => {
    const wrapper = shallow(<PlanDetail />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('should should match snapshot with report', () => {
    useHistoryMock.mockReturnValue({
      location: {
        pathname: '/auditPlan/detail/:auditPlanName/report/:reportId',
      },
    });

    const wrapper = shallow(<PlanDetail />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
