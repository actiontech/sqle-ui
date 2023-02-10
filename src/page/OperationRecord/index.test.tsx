import { shallow } from 'enzyme';
import OperationRecord from '.';
import toJson from 'enzyme-to-json';

describe('OperationRecord', () => {
  test('should render page header and describe', () => {
    const wrapper = shallow(<OperationRecord />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
