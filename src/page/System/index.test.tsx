import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import System from '.';
import { mockUseDispatch } from '../../testUtils/mockRedux';

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useEffect: (fn: any) => {
      fn();
    },
  };
});

describe('System', () => {
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    dispatchSpy = mockUseDispatch().scopeDispatch;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('should match snapshot', () => {
    const wrapper = shallow(<System />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalStatus: {
          Import_License: false,
        },
      },
      type: 'system/initModalStatus',
    });
  });
});
