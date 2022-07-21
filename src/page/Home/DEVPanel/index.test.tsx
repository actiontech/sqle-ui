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
import DEVPanel from './index';
import { createMemoryHistory } from 'history';
import { OrderListUrlParamsKey } from '../../Order/List/index.data';

describe('test home/DEVPanel', () => {
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
    const { container } = renderWithRouter(<DEVPanel />);
    expect(container).toMatchSnapshot();
  });

  test('should be called getWorkflowListV1 interface', async () => {
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithRouter(<DEVPanel />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(3);
  });

  test('should switch tab when clicking another tab title', async () => {
    renderWithRouter(<DEVPanel />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.getByText('dashboard.title.pendingReviewByMe').parentNode
    ).toHaveClass('ant-tabs-tab-active');
    expect(
      screen.getByText('dashboard.title.pendingExecByMe').parentNode
    ).not.toHaveClass('ant-tabs-tab-active');
    expect(
      screen.getByText('dashboard.title.rejectedOrderByMe').parentNode
    ).not.toHaveClass('ant-tabs-tab-active');

    fireEvent.click(screen.getByText('dashboard.title.pendingExecByMe'));
    expect(
      screen.getByText('dashboard.title.pendingExecByMe').parentNode
    ).toHaveClass('ant-tabs-tab-active');

    fireEvent.click(screen.getByText('dashboard.title.rejectedOrderByMe'));
    expect(
      screen.getByText('dashboard.title.rejectedOrderByMe').parentNode
    ).toHaveClass('ant-tabs-tab-active');
  });

  test('should be execute correspond event on the current tab', async () => {
    const history = createMemoryHistory();
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithServerRouter(<DEVPanel />, undefined, { history });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(3);

    expect(
      screen.getByText('dashboard.title.pendingReviewByMe').parentNode
    ).toHaveClass('ant-tabs-tab-active');

    fireEvent.click(screen.getByTestId('refreshTable'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(4);
    expect(getMockRequestSpy).toBeCalledWith({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_create_user_name: username,
      filter_status: getWorkflowListV1FilterStatusEnum.on_process,
      filter_current_step_type:
        getWorkflowListV1FilterCurrentStepTypeEnum.sql_review,
    });
    fireEvent.click(screen.getByText('common.showAll'));

    expect(history.location.pathname).toBe(`/order`);
    expect(history.location.search).toBe(
      `?${OrderListUrlParamsKey.createUsername}=${username}&${OrderListUrlParamsKey.currentStepType}=${getWorkflowListV1FilterCurrentStepTypeEnum.sql_review}&${OrderListUrlParamsKey.status}=${getWorkflowListV1FilterStatusEnum.on_process}`
    );

    fireEvent.click(screen.getByText('dashboard.title.pendingExecByMe'));
    fireEvent.click(screen.getByTestId('refreshTable'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(5);
    expect(getMockRequestSpy).toBeCalledWith({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_create_user_name: username,
      filter_status: getWorkflowListV1FilterStatusEnum.on_process,
      filter_current_step_type:
        getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute,
    });
    fireEvent.click(screen.getByText('common.showAll'));
    expect(history.location.pathname).toBe(`/order`);
    expect(history.location.search).toBe(
      `?${OrderListUrlParamsKey.createUsername}=${username}&${OrderListUrlParamsKey.currentStepType}=${getWorkflowListV1FilterCurrentStepTypeEnum.sql_execute}&${OrderListUrlParamsKey.status}=${getWorkflowListV1FilterStatusEnum.on_process}`
    );

    fireEvent.click(screen.getByText('dashboard.title.rejectedOrderByMe'));
    fireEvent.click(screen.getByTestId('refreshTable'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(6);
    expect(getMockRequestSpy).toBeCalledWith({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_create_user_name: username,
      filter_status: getWorkflowListV1FilterStatusEnum.rejected,
    });
    fireEvent.click(screen.getByText('common.showAll'));
    expect(history.location.pathname).toBe(`/order`);
    expect(history.location.search).toBe(
      `?${OrderListUrlParamsKey.createUsername}=${username}&${OrderListUrlParamsKey.status}=${getWorkflowListV1FilterStatusEnum.rejected}`
    );
  });
});
