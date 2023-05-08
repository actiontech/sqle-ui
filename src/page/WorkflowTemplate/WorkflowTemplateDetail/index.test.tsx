import { cleanup, screen, act } from '@testing-library/react';
import WorkflowTemplateDetail from '.';
import workflow from '../../../api/workflow';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { workflowData, workflowData2 } from '../__testData__';
import { useParams } from 'react-router-dom';
import { SystemRole } from '../../../data/common';
import { useSelector } from 'react-redux';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test.data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

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

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { role: SystemRole.admin, bindProjects: mockBindProjects },
        projectManage: { archived: false },
      })
    );
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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should hide update template feature when not currently a project manager or admin', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: SystemRole.admin,
          bindProjects: [{ projectName: 'test', isManager: false }],
        },
        projectManage: { archived: false },
      })
    );

    renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('workflowTemplate.detail.updateTemplate')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: '',
          bindProjects: mockBindProjects,
        },
        projectManage: { archived: false },
      })
    );

    renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('workflowTemplate.detail.updateTemplate')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: '',
          bindProjects: [{ projectName: 'default', isManager: false }],
        },
        projectManage: { archived: false },
      })
    );
    renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('workflowTemplate.detail.updateTemplate')
    ).not.toBeInTheDocument();
  });

  test('should render match text when choosing to match All privileged users', async () => {
    getWorkflowTemplateDetail.mockImplementation(() =>
      resolveThreeSecond(workflowData2)
    );
    const { container } = renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(
      screen.getByText(
        'workflowTemplate.form.label.reviewUser : workflowTemplate.progressConfig.review.reviewUserType.matchAudit'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'workflowTemplate.form.label.execUser : workflowTemplate.progressConfig.exec.executeUserType.matchExecute'
      )
    ).toBeInTheDocument();
  });

  test('should display the highest audit level allowed to create a order', async () => {
    getWorkflowTemplateDetail.mockImplementation(() =>
      resolveThreeSecond(workflowData)
    );

    renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('workflowTemplate.auditLevel.warn')
    ).toBeInTheDocument();
  });

  test('should hide the Create, Delete, Edit feature when project is archived', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: SystemRole.admin,
          bindProjects: [{ projectName, isManager: true }],
        },
        projectManage: { archived: true },
      })
    );

    renderWithThemeAndRouter(<WorkflowTemplateDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('workflowTemplate.detail.updateTemplate')
    ).not.toBeInTheDocument();
  });
});
