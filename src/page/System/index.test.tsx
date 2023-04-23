import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import System from '.';
import { useDispatch } from 'react-redux';

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useEffect: (fn: any) => {
      fn();
    },
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('System', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
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
