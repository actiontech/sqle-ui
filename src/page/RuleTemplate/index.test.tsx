import { shallow } from 'enzyme';
import RuleTemplate from '.';
import toJson from 'enzyme-to-json';

describe('RuleTemplate', () => {
  test('should render page header and describe', () => {
    const wrapper = shallow(<RuleTemplate />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
