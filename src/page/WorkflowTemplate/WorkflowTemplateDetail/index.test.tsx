import { cleanup, screen, waitFor } from '@testing-library/react';
import WorkflowTemplateDetail from '.';
import workflow from '../../../api/workflow';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { workflowData, workflowData2 } from '../__testData__';
import { useParams } from 'react-router-dom';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import { SystemRole } from '../../../data/common';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

const projectName = 'default';
describe('WorkflowTemplate/WorkflowTemplateDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getWorkflowTemplateDetail!: jest.SpyInstance;

  const mockGetWorkflowTemplateDetail = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(workflowData));
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ workflowName: 'default', projectName });
    getWorkflowTemplateDetail = mockGetWorkflowTemplateDetail();
    mockUseSelector({
      user: { role: SystemRole.admin, bindProjects: mockBindProjects },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    expect(container).toMatchSnapshot();
    expect(getWorkflowTemplateDetail).toBeCalledWith({
      project_name: projectName,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should hide update template feature when not currently a project manager or admin', async () => {
    mockUseSelector({
      user: {
        role: SystemRole.admin,
        bindProjects: [{ projectName: 'test', isManager: false }],
      },
    });

    renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('workflowTemplate.detail.updateTemplate')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      user: {
        role: '',
        bindProjects: mockBindProjects,
      },
    });
    renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('workflowTemplate.detail.updateTemplate')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      user: {
        role: '',
        bindProjects: [{ projectName: 'default', isManager: false }],
      },
    });
    renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('workflowTemplate.detail.updateTemplate')
    ).not.toBeInTheDocument();
  });

  test('should render match text when choosing to match All privileged users', async () => {
    getWorkflowTemplateDetail.mockImplementation(() =>
      resolveThreeSecond(workflowData2)
    );
    const { container } = renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
    expect(
      screen.queryByText(
        'workflowTemplate.form.label.reviewUser : workflowTemplate.progressConfig.review.reviewUserType.matchAudit'
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        'workflowTemplate.form.label.execUser : workflowTemplate.progressConfig.exec.executeUserType.matchExecute'
      )
    ).toBeInTheDocument();
  });
});
