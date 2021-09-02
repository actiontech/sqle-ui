import { shallow } from 'enzyme';
import PlanDetail from '.';
import toJSON from 'enzyme-to-json';
import { useParams } from 'react-router-dom';

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
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    const wrapper = shallow(<PlanDetail />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
