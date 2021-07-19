import { act, renderHook } from '@testing-library/react-hooks';
import { Select } from 'antd';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import useWorkflowTemplate from '.';
import workflow from '../../api/workflow';
import { resolveThreeSecond } from '../../testUtils/mockRequest';

describe('useWorkflowTemplate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockGetWorkflowTemplateTips = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateTipsV1');
    spy.mockImplementation(() =>
      resolveThreeSecond([
        { workflow_template_name: 'workflow-template-name-1' },
      ])
    );
    return spy;
  };

  test('should get workflow template when updateWorkflowTemplate is called', async () => {
    const getWorkflowSpy = mockGetWorkflowTemplateTips();
    const { result, waitForNextUpdate } = renderHook(() =>
      useWorkflowTemplate()
    );
    expect(result.current.loading).toBe(false);
    expect(getWorkflowSpy).not.toBeCalled();
    let wrapper = shallow(
      <Select>{result.current.generateWorkflowSelectOptions()}</Select>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    act(() => {
      result.current.updateWorkflowTemplate();
    });

    expect(result.current.loading).toBe(true);
    expect(getWorkflowSpy).toBeCalledTimes(1);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.workflowTemplate).toEqual([
      {
        workflow_template_name: 'workflow-template-name-1',
      },
    ]);
    wrapper = shallow(
      <Select>{result.current.generateWorkflowSelectOptions()}</Select>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
