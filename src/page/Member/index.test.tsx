import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Member from '.';

describe('test Member', () => {
  test('should match snapshot', () => {
    const wrapper = shallow(<Member />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
