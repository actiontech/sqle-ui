import { waitFor, screen, cleanup, fireEvent } from '@testing-library/react';
import OrderList from '.';
import workflow from '../../../api/workflow';
import {
  renderWithRouter,
  renderWithThemeAndRouter,
  renderWithThemeAndServerRouter,
} from '../../../testUtils/customRender';
import {
  mockUseInstance,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { createMemoryHistory } from 'history';
import { CustomProvider } from '../../../testUtils/mockRedux';
import { SystemRole } from '../../../data/common';
import { getAllBySelector } from '../../../testUtils/customQuery';
import { mockUseSelector } from '../../../testUtils/mockRedux';

describe('Order/List', () => {
  beforeEach(() => {
    mockUseInstance();
    mockUseUsername();
    jest.useFakeTimers();
    mockUseSelector({ user: { role: SystemRole.admin } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond([
        {
          create_time: '2021-04-29T05:41:24Z',
          create_user_name: 'admin',
          current_step_assignee_user_name_list: ['admin', 'test'],
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

  const mockBatchCancelOrder = () => {
    const spy = jest.spyOn(workflow, 'batchCancelWorkflowsV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should render order list by response data', async () => {
    const request = mockRequest();
    const { container } = renderWithThemeAndRouter(<OrderList />);
    expect(container).toMatchSnapshot();
    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should set filter info when url includes request params', async () => {
    const request = mockRequest();
    const history = createMemoryHistory();
    history.push(
      '/order?currentStepAssignee=admin&currentStepType=sql_execute&status=on_process&createUsername=createUser&executeTimeForm=2022-07-20%2011:15:02&executeTimeTo=2022-07-21%2011:15:02'
    );
    renderWithThemeAndServerRouter(<OrderList />, undefined, {
      history,
    });
    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith({
      filter_task_execute_start_time_from: '2022-07-20T11:15:02+08:00',
      filter_task_execute_start_time_to: '2022-07-21T11:15:02+08:00',
      filter_create_time_from: undefined,
      filter_create_time_to: undefined,
      filter_create_user_name: 'createUser',
      filter_current_step_assignee_user_name: 'admin',
      filter_current_step_type: 'sql_execute',
      filter_status: 'on_process',
      page_index: 1,
      page_size: 10,
    });
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('admin')).toHaveClass('ant-select-selection-item');
    expect(screen.getByText('createUser')).toBeInTheDocument();
    expect(screen.getByText('createUser')).toHaveClass(
      'ant-select-selection-item'
    );
    expect(screen.getByText('order.status.process')).toBeInTheDocument();
    expect(screen.getByText('order.status.process')).toHaveClass(
      'ant-select-selection-item'
    );
    expect(screen.getByText('order.workflowStatus.exec')).toBeInTheDocument();
    expect(screen.getByText('order.workflowStatus.exec')).toHaveClass(
      'ant-select-selection-item'
    );
    expect(screen.getByLabelText('order.order.executeTime')).toHaveValue(
      '2022-07-20 11:15:02'
    );
  });
  test('should can batch close order', async () => {
    const batchCancelSpy = mockBatchCancelOrder();
    const request = mockRequest();
    const { container, baseElement } = renderWithRouter(
      <CustomProvider
        initStore={{
          user: { role: SystemRole.admin },
        }}
      >
        <OrderList />
      </CustomProvider>
    );
    expect(container).toMatchSnapshot();
    expect(baseElement).toMatchSnapshot();
    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    const batchCancel = screen.getAllByText('order.batchCancel.batchDelete')[0];
    expect(batchCancel.parentNode).toBeDisabled();
    expect(getAllBySelector('.ant-checkbox-input')[0]).toBeEnabled();
    fireEvent.click(getAllBySelector('.ant-checkbox-input')[0]);
    expect(
      screen.getAllByText('order.batchCancel.batchDelete')[0]
    ).toBeEnabled();
    fireEvent.click(screen.getAllByText('order.batchCancel.batchDelete')[0]);
    expect(
      screen.queryByText('order.batchCancel.cancelPopTitle')
    ).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('common.ok')[0]);
    expect(batchCancelSpy).toBeCalledTimes(1);
    expect(batchCancelSpy).toBeCalledWith({ workflow_ids: ['1'] });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(request).toBeCalledTimes(2);
    expect(request).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
  });
});
