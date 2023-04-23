import { act, fireEvent, render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import ProjectOverview from '..';
import { resolveErrorThreeSecond } from '../../../../testUtils/mockRequest';
import {
  mockGetProjectDetail,
  mockGetProjectStatistics,
} from '../../__test__/utils';
import useNavigate from '../../../../hooks/useNavigate';
import { renderWithRouter } from '../../../../testUtils/customRender';
import { getHrefByText } from '../../../../testUtils/customQuery';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('../../../../hooks/useNavigate', () => jest.fn());
const projectName = 'default';

describe('test ProjectOverview', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getProjectDetailSpy: jest.SpyInstance;
  let getProjectStatistics: jest.SpyInstance;
  const navigateSpy = jest.fn();
  beforeEach(() => {
    getProjectDetailSpy = mockGetProjectDetail();
    getProjectStatistics = mockGetProjectStatistics();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    useParamsMock.mockReturnValue({ projectName });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  test('should match snapshot', async () => {
    const { container } = render(<ProjectOverview />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when get project statistics is wrong', async () => {
    getProjectStatistics.mockImplementation(() =>
      resolveErrorThreeSecond(undefined)
    );

    const { container } = render(<ProjectOverview />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should refresh project detail info and statistics info when clicking refresh button', async () => {
    expect(getProjectDetailSpy).toBeCalledTimes(0);
    expect(getProjectStatistics).toBeCalledTimes(0);
    render(<ProjectOverview />);
    expect(getProjectDetailSpy).toBeCalledTimes(1);
    expect(getProjectDetailSpy).toBeCalledWith({
      project_name: projectName,
    });
    expect(getProjectStatistics).toBeCalledTimes(1);
    expect(getProjectStatistics).toBeCalledWith({
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByTestId('refresh-project-info'));
    expect(getProjectDetailSpy).toBeCalledTimes(2);
    expect(getProjectDetailSpy).toBeCalledWith({
      project_name: projectName,
    });
    expect(getProjectStatistics).toBeCalledTimes(2);
    expect(getProjectStatistics).toBeCalledWith({
      project_name: projectName,
    });
  });

  test('should jump to path when clicking card', async () => {
    renderWithRouter(<ProjectOverview />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(
      screen.getByText('projectManage.projectOverview.orderTotal')
    );
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(1, `project/${projectName}/order`);

    fireEvent.click(
      screen.getByText('projectManage.projectOverview.auditPlanTotal')
    );
    expect(navigateSpy).toBeCalledTimes(2);
    expect(navigateSpy).nthCalledWith(2, `project/${projectName}/auditPlan`);

    fireEvent.click(
      screen.getByText('projectManage.projectOverview.instanceTotal')
    );
    expect(navigateSpy).toBeCalledTimes(3);
    expect(navigateSpy).nthCalledWith(3, `project/${projectName}/data`);

    fireEvent.click(
      screen.getByText('projectManage.projectOverview.memberTotal')
    );
    expect(navigateSpy).toBeCalledTimes(4);
    expect(navigateSpy).nthCalledWith(4, `project/${projectName}/member`);

    fireEvent.click(
      screen.getByText('projectManage.projectOverview.ruleTemplateTotal')
    );
    expect(navigateSpy).toBeCalledTimes(5);
    expect(navigateSpy).nthCalledWith(
      5,
      `project/${projectName}/rule/template`
    );

    fireEvent.click(
      screen.getByText('projectManage.projectOverview.whiteListTotal')
    );
    expect(navigateSpy).toBeCalledTimes(6);
    expect(navigateSpy).nthCalledWith(6, `project/${projectName}/whitelist`);
  });
});
