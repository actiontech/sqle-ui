import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PlanDetail from '.';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
  };
});

jest.mock('@mui/styles', () => {
  return {
    ...jest.requireActual('@mui/styles'),
    useTheme: jest.fn(),
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

describe('PlanDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const useHistoryMock: jest.Mock = useNavigate as jest.Mock;
  const useThemeMock: jest.Mock = useTheme as jest.Mock;
  beforeEach(() => {
    useParamsMock.mockReturnValue({
      auditPlanName: 'auditPlanName1',
    });
    useHistoryMock.mockReturnValue({ location: { pathname: '/' } });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/auditPlan/detail/:auditPlanName/report/:reportId',
    }));
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        projectManage: { archived: false },
      })
    );
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
