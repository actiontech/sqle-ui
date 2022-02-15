import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Role from '.';
import { renderWithRedux } from '../../../testUtils/customRender';
import { mockUseDispatch } from '../../../testUtils/mockRedux';

jest.mock('./RoleList', () => {
  return () => null;
});

describe('Role', () => {
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseDispatch();
    dispatchSpy = mockUseDispatch().scopeDispatch;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const wrapper = shallow(<Role />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should init modal status', () => {
    renderWithRedux(<Role />);
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalStatus: {
          ADD_ROLE: false,
          UPDATE_ROLE: false,
        },
      },
      type: 'user/initModalStatus',
    });
  });
});
