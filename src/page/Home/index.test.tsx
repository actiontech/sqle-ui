import toJson from 'enzyme-to-json';
import Home from '.';
import { shallowWithRouter } from '../../testUtils/customRender';
import { mockUseSelector } from '../../testUtils/mockRedux';

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: () => ({
      common: {
        padding: 24,
      },
    }),
  };
});

describe('Home', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should render page base element with username', () => {
    mockUseSelector({ user: { username: 'admin' } });
    const wrapper = shallowWithRouter(<Home />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
