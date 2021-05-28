import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import System from '.';

describe('System', () => {
  test('should match snapshot', () => {
    const wrapper = shallow(<System />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
