/* eslint-disable no-console */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import ProjectOverview from '..';
import { resolveErrorThreeSecond } from '../../../../testUtils/mockRequest';
import { mockGetProjectDetail } from '../../__test__/utils';
import useNavigate from '../../../../hooks/useNavigate';
import { renderWithRouterAndRedux } from '../../../../testUtils/customRender';
import { useTheme } from '@mui/styles';
import {
  mockGetProjectScore,
  mockGetInstanceHealth,
  mockGetRiskAuditPlan,
  mockGetRoleUserCount,
  mockGetWorkflowTemplateV1,
  mockStatisticAuditPlan,
  mockStatisticRiskWorkflow,
  mockStatisticWorkflowStatus,
  mockStatisticsAuditedSQL,
} from '../Panel/__test__/mockApi';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('../../../../hooks/useNavigate', () => jest.fn());
const projectName = 'default';

jest.mock('@mui/styles', () => {
  return {
    ...jest.requireActual('@mui/styles'),
    useTheme: jest.fn(),
  };
});

describe('test ProjectOverview', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  let getProjectDetailSpy: jest.SpyInstance;

  let getProjectScoreSpy: jest.SpyInstance;
  let getInstanceHealthSpy: jest.SpyInstance;
  let getRiskAuditPlanSpy: jest.SpyInstance;
  let getRoleUserCountSpy: jest.SpyInstance;
  let getWorkflowTemplateSpy: jest.SpyInstance;
  let statisticAuditPlanSpy: jest.SpyInstance;
  let statisticRiskWorkflowSpy: jest.SpyInstance;
  let statisticWorkflowStatusSpy: jest.SpyInstance;
  let statisticsAuditedSQLSpy: jest.SpyInstance;

  const navigateSpy = jest.fn();
  beforeEach(() => {
    getProjectDetailSpy = mockGetProjectDetail();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    useParamsMock.mockReturnValue({ projectName });
    jest.useFakeTimers();
    useThemeMock.mockReturnValue({ common: { padding: 24 } });

    getProjectScoreSpy = mockGetProjectScore();
    getInstanceHealthSpy = mockGetInstanceHealth();
    getRiskAuditPlanSpy = mockGetRiskAuditPlan();
    getRoleUserCountSpy = mockGetRoleUserCount();
    getWorkflowTemplateSpy = mockGetWorkflowTemplateV1();
    statisticAuditPlanSpy = mockStatisticAuditPlan();
    statisticRiskWorkflowSpy = mockStatisticRiskWorkflow();
    statisticWorkflowStatusSpy = mockStatisticWorkflowStatus();
    statisticsAuditedSQLSpy = mockStatisticsAuditedSQL();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  const error = console.error;

  beforeAll(() => {
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });
  });

  afterAll(() => {
    console.error = error;
  });
  test('should match snapshot', async () => {
    const { container } = renderWithRouterAndRedux(
      <ProjectOverview />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
        user: {
          theme: 'light',
        },
        locale: {
          language: 'zh-CN',
        },
      }
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should refresh project detail info and statistics info when clicking refresh button', async () => {
    expect(getProjectDetailSpy).toBeCalledTimes(0);
    renderWithRouterAndRedux(<ProjectOverview />, undefined, {
      projectManage: {
        overviewRefreshFlag: false,
      },
      user: {
        theme: 'light',
      },
      locale: {
        language: 'zh-CN',
      },
    });
    expect(getProjectDetailSpy).toBeCalledTimes(1);
    expect(getProjectDetailSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getProjectScoreSpy).toBeCalledTimes(1);
    expect(getProjectScoreSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getInstanceHealthSpy).toBeCalledTimes(1);
    expect(getInstanceHealthSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getRiskAuditPlanSpy).toBeCalledTimes(1);
    expect(getRiskAuditPlanSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getRoleUserCountSpy).toBeCalledTimes(1);
    expect(getRoleUserCountSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getWorkflowTemplateSpy).toBeCalledTimes(1);
    expect(getWorkflowTemplateSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(statisticAuditPlanSpy).toBeCalledTimes(1);
    expect(statisticAuditPlanSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(statisticRiskWorkflowSpy).toBeCalledTimes(1);
    expect(statisticRiskWorkflowSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(statisticWorkflowStatusSpy).toBeCalledTimes(1);
    expect(statisticWorkflowStatusSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(statisticsAuditedSQLSpy).toBeCalledTimes(1);
    expect(statisticsAuditedSQLSpy).toBeCalledWith({
      project_name: projectName,
    });

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByTestId('refresh-project-info'));
    expect(getProjectDetailSpy).toBeCalledTimes(2);
    expect(getProjectDetailSpy).toBeCalledWith({
      project_name: projectName,
    });
    expect(getProjectScoreSpy).toBeCalledTimes(2);
    expect(getProjectScoreSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getInstanceHealthSpy).toBeCalledTimes(2);
    expect(getInstanceHealthSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getRiskAuditPlanSpy).toBeCalledTimes(2);
    expect(getRiskAuditPlanSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getRoleUserCountSpy).toBeCalledTimes(2);
    expect(getRoleUserCountSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getWorkflowTemplateSpy).toBeCalledTimes(2);
    expect(getWorkflowTemplateSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(statisticAuditPlanSpy).toBeCalledTimes(2);
    expect(statisticAuditPlanSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(statisticRiskWorkflowSpy).toBeCalledTimes(2);
    expect(statisticRiskWorkflowSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(statisticWorkflowStatusSpy).toBeCalledTimes(2);
    expect(statisticWorkflowStatusSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(statisticsAuditedSQLSpy).toBeCalledTimes(2);
    expect(statisticsAuditedSQLSpy).toBeCalledWith({
      project_name: projectName,
    });
  });
});
