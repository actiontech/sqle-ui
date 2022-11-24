import ProjectDetail from '.';
import { mockUseDispatch } from '../../../testUtils/mockRedux';
import { useParams } from 'react-router-dom';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test';
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../testUtils/customRender';
import {
  mockUseAuditPlanTypes,
  mockUseInstance,
  mockUseUsername,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import user from '../../../api/user';
import {
  mockGetProjectDetail,
  mockGetProjectStatistics,
} from '../__test__/utils';
import { mockUseStyle } from '../../../testUtils/mockStyle';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = mockBindProjects[0].project_name;

describe('test ProjectManage/ProjectDetail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getUserSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  beforeEach(() => {
    getUserSpy = jest.spyOn(user, 'getCurrentUserV1');
    getUserSpy.mockImplementation(() =>
      resolveThreeSecond({
        user_name: 'test',
        is_admin: '',
        bind_projects: mockBindProjects,
      })
    );

    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseAuditPlanTypes();
    mockUseUsername();
    mockUseInstance();
    mockUseStyle();

    useParamsMock.mockReturnValue({ projectName });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
  });
  test('should render tips for unbound project', async () => {
    getUserSpy.mockImplementation(() =>
      resolveThreeSecond({
        user_name: 'test',
        is_admin: '',
        bind_projects: [],
      })
    );
    expect(getUserSpy).toBeCalledTimes(0);

    render(<ProjectDetail />);
    expect(getUserSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('projectManage.projectDetail.unboundProjectTips')
    ).toBeInTheDocument();
  });

  test('should clear user info when get current user is wrong', async () => {
    getUserSpy.mockImplementation(() => resolveErrorThreeSecond(undefined));
    expect(dispatchSpy).toBeCalledTimes(0);
    render(<ProjectDetail />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).nthCalledWith(1, {
      payload: { bindProjects: [] },
      type: 'user/updateBindProjects',
    });
    expect(dispatchSpy).nthCalledWith(2, {
      payload: { username: '', role: '' },
      type: 'user/updateUser',
    });
    expect(dispatchSpy).nthCalledWith(3, {
      payload: { token: '' },
      type: 'user/updateToken',
    });
  });

  test('should match snapshot when bound project exists', async () => {
    const getProjectDetailSpy = mockGetProjectDetail();
    const getProjectStatistics = mockGetProjectStatistics();
    const { container } = renderWithRouter(<ProjectDetail />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(container).toMatchSnapshot();
    expect(getProjectDetailSpy).toBeCalledTimes(1);
    expect(getProjectStatistics).toBeCalledTimes(1);
  });
});
