import { shallow } from 'enzyme';
import RuleTemplate from '.';
import toJson from 'enzyme-to-json';

describe('RuleTemplate', () => {
  test('should match snapshot', () => {
    const wrapper = shallow(<RuleTemplate />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
