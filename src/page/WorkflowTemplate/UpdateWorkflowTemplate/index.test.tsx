import { waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import { useParams } from 'react-router-dom';
import UpdateWorkflowTemplate from '.';
import {
  CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum,
  WorkFlowStepTemplateReqV1TypeEnum,
} from '../../../api/common.enum';
import workflow from '../../../api/workflow';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import {
  mockUseInstance,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { workflowData } from '../__testData__';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

describe('UpdateWorkflowTemplate', () => {
  let getWorkflowTemplateSpy!: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseUsername();
    mockUseInstance();
    useParamsMock.mockReturnValue({ workflowName: 'default' });
    getWorkflowTemplateSpy = mockGetWorkflowTemplate();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  const mockUpdateWorkflowTemplate = () => {
    const spy = jest.spyOn(workflow, 'updateWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockGetWorkflowTemplate = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(workflowData));
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = renderWithThemeAndRouter(<UpdateWorkflowTemplate />);
    expect(container).toMatchSnapshot();
    expect(getWorkflowTemplateSpy).toBeCalledWith({
      workflow_template_name: 'default',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should send create workflow template when user submit all form', async () => {
    const updateSpy = mockUpdateWorkflowTemplate();
    const shallowWrapper = shallow(<UpdateWorkflowTemplate />);
    const formWrapper = shallowWrapper.find('WorkflowTemplateForm');
    formWrapper.prop<Function>('updateBaseInfo')({
      name: 'default',
      desc: 'desc1',
      allowSubmitWhenLessAuditLevel:
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal,
      instanceNameList: ['instanceList1'],
    });
    formWrapper.prop<Function>('submitProgress')([
      {
        assignee_user_name_list: ['name1'],
        desc: 'desc1',
        type: WorkFlowStepTemplateReqV1TypeEnum.sql_review,
      },
      {
        assignee_user_name_list: [],
        desc: 'desc2',
        type: WorkFlowStepTemplateReqV1TypeEnum.sql_review,
        approved_by_authorized: true,
      },
      {
        assignee_user_name_list: ['name2'],
        desc: 'desc2',
        type: WorkFlowStepTemplateReqV1TypeEnum.sql_execute,
      },
    ]);
    expect(updateSpy).toBeCalledWith({
      workflow_template_name: 'default',
      desc: 'desc1',
      allow_submit_when_less_audit_level:
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal,
      instance_name_list: ['instanceList1'],
      workflow_step_template_list: [
        {
          assignee_user_name_list: ['name1'],
          desc: 'desc1',
          type: WorkFlowStepTemplateReqV1TypeEnum.sql_review,
        },
        {
          assignee_user_name_list: [],
          desc: 'desc2',
          type: WorkFlowStepTemplateReqV1TypeEnum.sql_review,
          approved_by_authorized: true,
        },
        {
          assignee_user_name_list: ['name2'],
          desc: 'desc2',
          type: WorkFlowStepTemplateReqV1TypeEnum.sql_execute,
        },
      ],
    });
  });
});
