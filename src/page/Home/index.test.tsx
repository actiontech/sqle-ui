import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import Home from '.';
import dashboard from '../../api/dashboard';
import workflow from '../../api/workflow';
import { renderWithRouter } from '../../testUtils/customRender';
import { mockUseSelector } from '../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../testUtils/mockRequest';

describe('Home', () => {
  const mockGetDashboardV1 = () => {
    const spy = jest.spyOn(dashboard, 'getDashboardV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        workflow_statistics: {
          my_need_review_workflow_number: 2,

          my_need_execute_workflow_number: 99,

          my_rejected_workflow_number: 0,

          need_me_to_execute_workflow_number: 80,

          need_me_to_review_workflow_number: 102,
        },
      })
    );
    return spy;
  };
  const mockGetDashboardProjectTipsV1 = () => {
    const spy = jest.spyOn(dashboard, 'getDashboardProjectTipsV1');
    spy.mockImplementation(() =>
      resolveThreeSecond([
        { project_name: 'aaa', unfinished_workflow_count: 1 },
        { project_name: 'default', unfinished_workflow_count: 8 },
      ])
    );
    return spy;
  };

  const mockGetGlobalWorkflows = () => {
    const spy = jest.spyOn(workflow, 'getGlobalWorkflowsV1');
    spy.mockImplementation(() => resolveThreeSecond([]));
    return spy;
  };

  const mockGetWorkflows = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowsV1');
    spy.mockImplementation(() => resolveThreeSecond([]));
    return spy;
  };

  let getGlobalWorkflowsSpy: jest.SpyInstance;
  let getWorkflowsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { username: 'admin' } });
    getGlobalWorkflowsSpy = mockGetGlobalWorkflows();
    getWorkflowsSpy = mockGetWorkflows();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();

    cleanup();
  });

  let errorSpy!: jest.SpyInstance;

  beforeAll(() => {
    const error = global.console.error;
    errorSpy = jest.spyOn(global.console, 'error');
    errorSpy.mockImplementation((message: string) => {
      if (
        message.includes(
          ' React does not recognize the `showLabel` prop on a DOM element'
        )
      ) {
        return;
      }
      error(message);
    });
  });
  afterAll(() => {
    errorSpy.mockRestore();
  });

  test('should match snapshot', async () => {
    mockGetDashboardV1();
    mockGetDashboardProjectTipsV1();
    const { container } = renderWithRouter(<Home />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    // fix local snapshot are different from github actions
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });

  test('should be called getDashboardV1 interface', async () => {
    const getDashboardSpy = mockGetDashboardV1();
    const getDashboardProjectTipsSpy = mockGetDashboardProjectTipsV1();
    expect(getDashboardSpy).toBeCalledTimes(0);
    expect(getDashboardProjectTipsSpy).toBeCalledTimes(0);
    renderWithRouter(<Home />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getDashboardSpy).toBeCalledTimes(1);
    expect(getDashboardProjectTipsSpy).toBeCalledTimes(1);
  });

  test('should be called request when changed project name', async () => {
    mockGetDashboardV1();
    mockGetDashboardProjectTipsV1();

    renderWithRouter(<Home />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('dashboard.allProjectTip')).toBeInTheDocument();
    expect(getGlobalWorkflowsSpy).toBeCalledTimes(6);

    fireEvent.mouseDown(screen.getByText('dashboard.allProjectTip'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getAllByText('default')[1]);

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(getWorkflowsSpy).toBeCalledTimes(6);
  });
});
