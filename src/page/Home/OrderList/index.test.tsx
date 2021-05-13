import { waitFor } from '@testing-library/react';
import OrderList from '.';
import { IWorkflowDetailResV1 } from '../../../api/common';
import {
  WorkflowDetailResV1CurrentStepTypeEnum,
  WorkflowDetailResV1StatusEnum,
  WorkflowDetailResV1TaskStatusEnum,
} from '../../../api/common.enum';
import workflow from '../../../api/workflow';
import {
  renderWithRouter,
  renderWithThemeAndRouter,
} from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

describe('Home/OrderList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockRequest = (orderList: IWorkflowDetailResV1[]) => {
    const spy = jest.spyOn(workflow, 'getWorkflowListV1');
    spy.mockImplementation(() => resolveThreeSecond(orderList));
    return spy;
  };

  test('should render loading spin and empty message when response is empty array', async () => {
    mockRequest([]);
    const { container } = renderWithThemeAndRouter(<OrderList />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should render order list when response is not empty', async () => {
    const request = mockRequest([
      {
        create_time: '2021-04-29T05:41:24Z',
        create_user_name: 'admin',
        current_step_assignee_user_name_list: ['admin'],
        current_step_type: WorkflowDetailResV1CurrentStepTypeEnum.sql_execute,
        desc: '',
        status: WorkflowDetailResV1StatusEnum.on_process,
        subject: 'order123',
        task_instance_name: 'db1',
        task_instance_schema: '',
        task_pass_rate: 0,
        task_status: WorkflowDetailResV1TaskStatusEnum.audited,
        workflow_id: 1,
      },
    ]);
    const { container } = renderWithThemeAndRouter(
      <OrderList
        requestParams={{
          filter_create_user_name: 'aaa',
          filter_current_step_assignee_user_name: 'mmm',
        }}
      />
    );
    expect(request).toBeCalledWith({
      filter_create_user_name: 'aaa',
      filter_current_step_assignee_user_name: 'mmm',
      page_index: 1,
      page_size: 10,
    });
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
