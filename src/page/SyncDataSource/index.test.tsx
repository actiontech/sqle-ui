import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SyncDataSource from '.';

describe('test SyncDataSource', () => {
  test('should match snapshot', () => {
    const wrapper = shallow(<SyncDataSource />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
