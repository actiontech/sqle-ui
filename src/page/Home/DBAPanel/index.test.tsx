import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import workflow from '../../../api/workflow';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '../CommonTable';
import DBAPanel from './index';
import { createMemoryHistory } from 'history';

describe('test home/DBAPanel', () => {
  const mockRequest = () => {
    const spy = jest.spyOn(workflow, 'getGlobalWorkflowsV1');
    spy.mockImplementation(() =>
      resolveThreeSecond([
        {
          create_time: '2021-04-29T05:41:24Z',
          create_user_name: 'admin',
          current_step_assignee_user_name_list: ['admin'],
          current_step_type: 'sql_execute',
          desc: '',
          status: 'wait_for_audit',
          workflow_name: 'order123',
          project_name: 'default',
        },
      ])
    );
    return spy;
  };

  let getMockRequestSpy: jest.SpyInstance;
  const username = 'admin';
  const mockGetWorkflowStatistics = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    getMockRequestSpy = mockRequest();
    mockUseSelector({ user: { username } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  test('should match snapshot', () => {
    const { container } = renderWithRouter(
      <DBAPanel getWorkflowStatistics={mockGetWorkflowStatistics} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should be called getWorkflowsV2 interface', async () => {
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithRouter(
      <DBAPanel getWorkflowStatistics={mockGetWorkflowStatistics} />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(2);
  });

  test('should switch tab when clicking another tab title', async () => {
    renderWithRouter(
      <DBAPanel getWorkflowStatistics={mockGetWorkflowStatistics} />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.getByText('dashboard.pendingOrder.needMeReview').parentNode
    ).toHaveClass('ant-tabs-tab-active');
    expect(
      screen.getByText('dashboard.pendingOrder.needMeExec').parentNode
    ).not.toHaveClass('ant-tabs-tab-active');

    fireEvent.click(screen.getByText('dashboard.pendingOrder.needMeExec'));

    expect(
      screen.getByText('dashboard.pendingOrder.needMeReview').parentNode
    ).not.toHaveClass('ant-tabs-tab-active');
    expect(
      screen.getByText('dashboard.pendingOrder.needMeExec').parentNode
    ).toHaveClass('ant-tabs-tab-active');
  });

  test('should be execute correspond event on the current tab', async () => {
    const history = createMemoryHistory();
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithServerRouter(
      <DBAPanel getWorkflowStatistics={mockGetWorkflowStatistics} />,
      undefined,
      { history }
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(2);

    expect(
      screen.getByText('dashboard.pendingOrder.needMeReview').parentNode
    ).toHaveClass('ant-tabs-tab-active');

    fireEvent.click(screen.getByTestId('refreshTable'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockGetWorkflowStatistics).toBeCalledTimes(1);
    expect(getMockRequestSpy).toBeCalledTimes(4);
    expect(getMockRequestSpy.mock.calls[2][0]).toEqual({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_current_step_assignee_user_name: username,
      filter_status: 'wait_for_execution',
    });
    expect(getMockRequestSpy.mock.calls[3][0]).toEqual({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_current_step_assignee_user_name: username,
      filter_status: 'wait_for_audit',
    });

    fireEvent.click(screen.getByText('dashboard.pendingOrder.needMeExec'));
    fireEvent.click(screen.getByTestId('refreshTable'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockGetWorkflowStatistics).toBeCalledTimes(2);
    expect(getMockRequestSpy).toBeCalledTimes(6);
  });
});
