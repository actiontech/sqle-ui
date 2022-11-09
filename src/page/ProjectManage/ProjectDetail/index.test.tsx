import { shallow } from 'enzyme';
import ProjectDetail from '.';
import toJSON from 'enzyme-to-json';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import { SystemRole } from '../../../data/common';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('test ProjectManage/ProjectDetail', () => {
  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    mockUseSelector({
      user: { token: '', role: SystemRole.admin },
    });

    useLocationMock.mockImplementation(() => {
      return { state: { projectName: 'test' } };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should match snapshot', () => {
    const wrapper = shallow(<ProjectDetail />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
