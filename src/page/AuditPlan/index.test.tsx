import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import AuditPlan from '.';

describe('AuditPlan', () => {
  test('should match snapshot', () => {
    const wrapper = shallow(<AuditPlan />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
