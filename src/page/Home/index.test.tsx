import { cleanup, waitFor } from '@testing-library/react';
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
  const mockRequest = () => {
    const spy = jest.spyOn(workflow, 'getGlobalWorkflowsV1');
    spy.mockImplementation(() => resolveThreeSecond([]));
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { username: 'admin' } });
    mockRequest();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();

    cleanup();
  });

  test('should match snapshot', async () => {
    mockGetDashboardV1();
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
    expect(getDashboardSpy).toBeCalledTimes(0);
    renderWithRouter(<Home />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getDashboardSpy).toBeCalledTimes(1);
  });
});
