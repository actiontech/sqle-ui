import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import User from '.';
import { renderWithRedux } from '../../../testUtils/customRender';
import { mockUseDispatch } from '../../../testUtils/mockRedux';

jest.mock('./UserList', () => {
  return () => null;
});

describe('User', () => {
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
    const wrapper = shallow(<User />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should init modal status', () => {
    renderWithRedux(<User />);
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalStatus: {
          ADD_USER: false,
          Update_User: false,
          Update_User_Password: false,
        },
      },
      type: 'user/initModalStatus',
    });
  });
});
