import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import workflow from '../../../api/workflow';
import {
  getWorkflowListV1FilterCurrentStepTypeEnum,
  getWorkflowListV1FilterStatusEnum,
} from '../../../api/workflow/index.enum';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '../CommonTable';
import DBAPanel from './index';
import { createMemoryHistory } from 'history';
import { OrderListUrlParamsKey } from '../../Order/List/index.data';

describe('test home/DBAPanel', () => {
  const mockRequest = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowListV1');
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
      <DBAPanel getWorkflowStatistics={mockGetWorkflowStatistics} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should be called getWorkflowListV1 interface', async () => {
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
      filter_status: getWorkflowListV1FilterStatusEnum.on_process,
      filter_current_step_type:
        getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute,
    });
    expect(getMockRequestSpy.mock.calls[3][0]).toEqual({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_current_step_assignee_user_name: username,
      filter_status: getWorkflowListV1FilterStatusEnum.on_process,
      filter_current_step_type:
        getWorkflowListV1FilterCurrentStepTypeEnum.sql_review,
    });

    fireEvent.click(screen.getByText('common.more'));
    expect(history.location.pathname).toBe(`/order`);
    expect(history.location.search).toBe(
      `?${OrderListUrlParamsKey.currentStepAssignee}=${username}&${OrderListUrlParamsKey.currentStepType}=${getWorkflowListV1FilterCurrentStepTypeEnum.sql_review}&${OrderListUrlParamsKey.status}=${getWorkflowListV1FilterStatusEnum.on_process}`
    );

    fireEvent.click(screen.getByText('dashboard.pendingOrder.needMeExec'));
    fireEvent.click(screen.getByTestId('refreshTable'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockGetWorkflowStatistics).toBeCalledTimes(2);
    expect(getMockRequestSpy).toBeCalledTimes(6);

    fireEvent.click(screen.getByText('common.more'));
    expect(history.location.pathname).toBe(`/order`);
    expect(history.location.search).toBe(
      `?${OrderListUrlParamsKey.currentStepAssignee}=${username}&${OrderListUrlParamsKey.currentStepType}=${getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute}&${OrderListUrlParamsKey.status}=${getWorkflowListV1FilterStatusEnum.on_process}`
    );
  });
});
