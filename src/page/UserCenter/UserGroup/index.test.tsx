import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import UserGroup from '.';
import { renderWithRedux } from '../../../testUtils/customRender';
import { mockUseDispatch } from '../../../testUtils/mockRedux';

jest.mock('./UserGroupList', () => {
  return () => null;
});

describe('UserGroup', () => {
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
    const wrapper = shallow(<UserGroup />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should init modal status', () => {
    renderWithRedux(<UserGroup />);
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalStatus: {
          ADD_USER_GROUP: false,
          Update_User_Group: false,
        },
      },
      type: 'user/initModalStatus',
    });
  });
});
