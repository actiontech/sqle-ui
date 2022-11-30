import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import WorkflowTemplate from '.';

describe('WorkflowTemplate', () => {
  test('should match snapshot', () => {
    const shallowWrapper = shallow(<WorkflowTemplate />);
    expect(toJson(shallowWrapper)).toMatchSnapshot();
  });
});
