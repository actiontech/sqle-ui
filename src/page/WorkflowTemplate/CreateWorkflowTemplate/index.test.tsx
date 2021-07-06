import { shallow } from 'enzyme';
import CreateWorkflowTemplate from '.';
import { WorkFlowStepTemplateReqV1TypeEnum } from '../../../api/common.enum';
import workflow from '../../../api/workflow';
import EmitterKey from '../../../data/EmitterKey';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import {
  mockUseInstance,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';

describe('CreateWorkflowTemplate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseUsername();
    mockUseInstance();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  const mockCreateWorkflowTemplate = () => {
    const spy = jest.spyOn(workflow, 'createWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = renderWithThemeAndRouter(<CreateWorkflowTemplate />);
    expect(container).toMatchSnapshot();
  });

  test('should send create workflow template when user submit all form', async () => {
    const createSpy = mockCreateWorkflowTemplate();
    const shallowWrapper = shallow(<CreateWorkflowTemplate />);
    const formWrapper = shallowWrapper.find('WorkflowTemplateForm');
    formWrapper.prop<Function>('updateBaseInfo')({
      name: 'name1',
      desc: 'desc1',
      instanceNameList: ['instanceList1'],
    });
    formWrapper.prop<Function>('submitProgress')([
      {
        assignee_user_name_list: ['name1'],
        desc: 'desc1',
        type: WorkFlowStepTemplateReqV1TypeEnum.sql_review,
      },
      {
        assignee_user_name_list: ['name2'],
        desc: 'desc2',
        type: WorkFlowStepTemplateReqV1TypeEnum.sql_review,
      },
      {
        assignee_user_name_list: ['name2'],
        desc: 'desc2',
        type: WorkFlowStepTemplateReqV1TypeEnum.sql_execute,
      },
    ]);
    expect(createSpy).toBeCalledWith({
      workflow_template_name: 'name1',
      desc: 'desc1',
      instance_name_list: ['instanceList1'],
      workflow_step_template_list: [
        {
          assignee_user_name_list: ['name1'],
          desc: 'desc1',
          type: WorkFlowStepTemplateReqV1TypeEnum.sql_review,
        },
        {
          assignee_user_name_list: ['name2'],
          desc: 'desc2',
          type: WorkFlowStepTemplateReqV1TypeEnum.sql_review,
        },
        {
          assignee_user_name_list: ['name2'],
          desc: 'desc2',
          type: WorkFlowStepTemplateReqV1TypeEnum.sql_execute,
        },
      ],
    });
  });

  test('should dispatch reset form event when user click reset all from button', async () => {
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    const shallowWrapper = shallow(<CreateWorkflowTemplate />);

    const LinkWrapper = shallow(
      shallowWrapper.find('Result').prop<JSX.Element>('subTitle')
    );
    LinkWrapper.prop<Function>('onClick')();
    expect(emitSpy).toBeCalledWith(EmitterKey.Reset_Workflow_Template_Form);
  });
});
