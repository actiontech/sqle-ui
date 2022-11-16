import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import workflow from '../../../api/workflow';
import {
  getWorkflowsV1FilterStatusEnum,
  getGlobalWorkflowsV1FilterStatusEnum,
} from '../../../api/workflow/index.enum';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '../CommonTable';
import DEVPanel from './index';
import { createMemoryHistory } from 'history';
import { OrderListUrlParamsKey } from '../../Order/List/index.data';

describe('test home/DEVPanel', () => {
  const mockRequest = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowsV2');
    spy.mockImplementation(() =>
      resolveThreeSecond([
        {
          create_time: '2021-04-29T05:41:24Z',
          create_user_name: 'admin',
          current_step_assignee_user_name_list: ['admin'],
          current_step_type: 'sql_execute',
          desc: '',
          status: 'on_process',
          subject: 'order123',
          task_instance_name: 'db1',
          task_instance_schema: '',
          task_pass_rate: 0,
          task_status: 'audited',
          workflow_id: 1,
          task_score: 30,
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
      <DEVPanel getWorkflowStatistics={mockGetWorkflowStatistics} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should be called getWorkflowsV2 interface', async () => {
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithRouter(
      <DEVPanel getWorkflowStatistics={mockGetWorkflowStatistics} />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(3);
  });

  test('should switch tab when clicking another tab title', async () => {
    renderWithRouter(
      <DEVPanel getWorkflowStatistics={mockGetWorkflowStatistics} />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.getByText('dashboard.myOrderSituation.pendingReviewByMe')
        .parentNode
    ).toHaveClass('ant-tabs-tab-active');
    expect(
      screen.getByText('dashboard.myOrderSituation.pendingExecByMe').parentNode
    ).not.toHaveClass('ant-tabs-tab-active');
    expect(
      screen.getByText('dashboard.myOrderSituation.rejectedOrderByMe')
        .parentNode
    ).not.toHaveClass('ant-tabs-tab-active');

    fireEvent.click(
      screen.getByText('dashboard.myOrderSituation.pendingExecByMe')
    );
    expect(
      screen.getByText('dashboard.myOrderSituation.pendingExecByMe').parentNode
    ).toHaveClass('ant-tabs-tab-active');

    fireEvent.click(
      screen.getByText('dashboard.myOrderSituation.rejectedOrderByMe')
    );
    expect(
      screen.getByText('dashboard.myOrderSituation.rejectedOrderByMe')
        .parentNode
    ).toHaveClass('ant-tabs-tab-active');
  });

  test('should be execute correspond event on the current tab', async () => {
    const history = createMemoryHistory();
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithServerRouter(
      <DEVPanel getWorkflowStatistics={mockGetWorkflowStatistics} />,
      undefined,
      { history }
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(3);
    expect(mockGetWorkflowStatistics).toBeCalledTimes(0);

    expect(
      screen.getByText('dashboard.myOrderSituation.pendingReviewByMe')
        .parentNode
    ).toHaveClass('ant-tabs-tab-active');

    fireEvent.click(screen.getByTestId('refreshTable'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockGetWorkflowStatistics).toBeCalledTimes(1);
    expect(getMockRequestSpy).toBeCalledTimes(6);
    expect(getMockRequestSpy.mock.calls[3][0]).toEqual({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_create_user_name: username,
      filter_status: 'wait_for_execution',
    });
    expect(getMockRequestSpy.mock.calls[4][0]).toEqual({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_create_user_name: username,
      filter_status: 'wait_for_audit',
    });
    expect(getMockRequestSpy.mock.calls[5][0]).toEqual({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_create_user_name: username,
      filter_status: getGlobalWorkflowsV1FilterStatusEnum.rejected,
    });

    fireEvent.click(screen.getByText('common.more'));
    expect(history.location.pathname).toBe(`/order`);
    expect(history.location.search).toBe(
      `?${OrderListUrlParamsKey.createUsername}=${username}&${OrderListUrlParamsKey.currentStepType}=${getWorkflowsV1FilterStatusEnum.sql_review}&${OrderListUrlParamsKey.status}=${getGlobalWorkflowsV1FilterStatusEnum.wait_for_audit}`
    );

    fireEvent.click(
      screen.getByText('dashboard.myOrderSituation.pendingExecByMe')
    );
    fireEvent.click(screen.getByTestId('refreshTable'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(9);
    expect(mockGetWorkflowStatistics).toBeCalledTimes(2);

    fireEvent.click(screen.getByText('common.more'));
    expect(history.location.pathname).toBe(`/order`);
    expect(history.location.search).toBe(
      `?${OrderListUrlParamsKey.createUsername}=${username}&${OrderListUrlParamsKey.currentStepType}=${getWorkflowsV1FilterStatusEnum.sql_execute}&${OrderListUrlParamsKey.status}=${getGlobalWorkflowsV1FilterStatusEnum.wait_for_execution}`
    );

    fireEvent.click(
      screen.getByText('dashboard.myOrderSituation.rejectedOrderByMe')
    );
    fireEvent.click(screen.getByTestId('refreshTable'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(12);
    expect(mockGetWorkflowStatistics).toBeCalledTimes(3);

    fireEvent.click(screen.getByText('common.more'));
    expect(history.location.pathname).toBe(`/order`);
    expect(history.location.search).toBe(
      `?${OrderListUrlParamsKey.createUsername}=${username}&${OrderListUrlParamsKey.status}=${getGlobalWorkflowsV1FilterStatusEnum.rejected}`
    );
  });
});
