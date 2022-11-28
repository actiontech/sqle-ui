import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DataSource from '.';

describe('DataSource', () => {
  test('should render page title and page describe', () => {
    const wrapper = shallow(<DataSource />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
