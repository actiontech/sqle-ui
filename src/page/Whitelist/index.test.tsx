import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Whitelist from '.';

describe('Whitelist', () => {
  test('should match snapshot', () => {
    const wrapper = shallow(<Whitelist />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
