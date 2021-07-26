import { waitFor, screen, cleanup, fireEvent } from '@testing-library/react';
import OrderList from '.';
import workflow from '../../../api/workflow';
import {
  renderWithRouter,
  renderWithServerRouter,
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

describe('Order/List', () => {
  beforeEach(() => {
    mockUseInstance();
    mockUseUsername();
    jest.useFakeTimers();
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
    const { container } = renderWithRouter(
      <CustomProvider
        initStore={{
          user: { role: SystemRole.admin },
        }}
      >
        <OrderList />
      </CustomProvider>
    );
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
      '/order?currentStepAssignee=admin&currentStepType=sql_execute&status=on_process'
    );
    renderWithServerRouter(
      <CustomProvider
        initStore={{
          user: { role: SystemRole.admin },
        }}
      >
        <OrderList />
      </CustomProvider>,
      undefined,
      {
        history,
      }
    );
    expect(request).toBeCalledTimes(1);
    expect(request).toBeCalledWith({
      filter_current_step_assignee_user_name: 'admin',
      filter_current_step_type: 'sql_execute',
      filter_status: 'on_process',
      page_index: 1,
      page_size: 10,
    });
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('admin')).toHaveClass('ant-select-selection-item');
    expect(screen.getByText('order.status.process')).toBeInTheDocument();
    expect(screen.getByText('order.status.process')).toHaveClass(
      'ant-select-selection-item'
    );
    expect(screen.getByText('order.workflowStatus.exec')).toBeInTheDocument();
    expect(screen.getByText('order.workflowStatus.exec')).toHaveClass(
      'ant-select-selection-item'
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
