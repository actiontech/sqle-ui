import ProjectDetail from '.';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import { SystemRole } from '../../../data/common';
import { useParams } from 'react-router-dom';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test';
import { render, screen, waitFor } from '@testing-library/react';
import { mockGetProjectDetail } from './Layout/__test__/utils';
import { renderWithRouter } from '../../../testUtils/customRender';
import {
  mockUseAuditPlanTypes,
  mockUseInstance,
  mockUseUsername,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import workflow from '../../../api/workflow';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = mockBindProjects[0].project_name;

describe('test ProjectManage/ProjectDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getProjectDetailSpy: jest.SpyInstance;

  const mockGetWorkflows = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowsV1');
    spy.mockImplementation(() => resolveThreeSecond([]));
    return spy;
  };

  beforeEach(() => {
    mockUseSelector({
      user: { role: SystemRole.admin, bindProjects: [] },
    });
    mockUseAuditPlanTypes();
    mockUseUsername();
    mockUseInstance();
    mockGetWorkflows();
    getProjectDetailSpy = mockGetProjectDetail();

    useParamsMock.mockReturnValue({ projectName });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
  });
  test('should render tips for unbound project', () => {
    render(<ProjectDetail />);
    expect(getProjectDetailSpy).toBeCalledTimes(0);
    expect(
      screen.getByText('projectManage.projectDetail.unboundProjectTips')
    ).toBeInTheDocument();
  });

  test('should get project detail info when bound project exists', async () => {
    mockUseSelector({
      user: { role: SystemRole.admin, bindProjects: mockBindProjects },
    });
    expect(getProjectDetailSpy).toBeCalledTimes(0);
    const { container } = renderWithRouter(<ProjectDetail />);
    expect(getProjectDetailSpy).toBeCalledTimes(1);
    expect(getProjectDetailSpy).toBeCalledWith({
      project_name: projectName,
    });
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should render error message when get data is wrong', async () => {
    mockUseSelector({
      user: { role: SystemRole.admin, bindProjects: mockBindProjects },
    });
    getProjectDetailSpy.mockImplementation(() =>
      resolveErrorThreeSecond(undefined)
    );
    const { container } = render(<ProjectDetail />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
