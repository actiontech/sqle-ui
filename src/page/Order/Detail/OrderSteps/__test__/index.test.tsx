import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { WorkflowRecordResV1StatusEnum } from '../../../../../api/common.enum';
import { getBySelector } from '../../../../../testUtils/customQuery';
import { mockUseSelector } from '../../../../../testUtils/mockRedux';
import OrderStep from '../index';
import {
  defaultProps,
  executeStepList,
  rejectedStepList,
  waitAuditStepList,
} from './testData';
import { act } from 'react-dom/test-utils';
const realDateNow = Date.now.bind(global.Date);

describe('test OrderSteps', () => {
  const mockPass = jest.fn();
  const mockReject = jest.fn();
  const mockModifySql = jest.fn();
  const mockExecuting = jest.fn();
  const mockComplete = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { username: 'admin' } });
    mockPass.mockImplementation(
      () =>
        new Promise((res) => {
          setTimeout(() => {
            res(null);
          }, 3000);
        })
    );
    mockReject.mockImplementation(
      () =>
        new Promise((res) => {
          setTimeout(() => {
            res(null);
          }, 3000);
        })
    );
    mockModifySql.mockImplementation(
      () =>
        new Promise((res) => {
          setTimeout(() => {
            res(null);
          }, 3000);
        })
    );
    mockExecuting.mockImplementation(
      () =>
        new Promise((res) => {
          setTimeout(() => {
            res(null);
          }, 3000);
        })
    );
    mockComplete.mockImplementation(
      () =>
        new Promise((res) => {
          setTimeout(() => {
            res(null);
          }, 3000);
        })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot with default props', () => {
    const { container } = render(<OrderStep {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  test('should render audit button and reject button when current order status is equal wait for audit and can reject order is equal true', async () => {
    const { rerender } = render(
      <OrderStep
        {...defaultProps}
        currentOrderStatus={WorkflowRecordResV1StatusEnum.wait_for_audit}
        canRejectOrder={false}
        pass={mockPass}
        stepList={waitAuditStepList}
        tasksStatusNumber={{ executing: 0, failed: 0, success: 0 }}
        currentStep={2}
      />
    );
    expect(mockPass).toBeCalledTimes(0);
    expect(screen.getByText('order.operator.sqlReview')).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.operator.sqlReview'));
    expect(mockPass).toBeCalledTimes(1);
    expect(mockPass).toBeCalledWith(waitAuditStepList[1].workflow_step_id);
    expect(
      screen.getByText('order.operator.sqlReview').closest('button')
    ).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.operator.sqlReview').closest('button')
    ).not.toHaveClass('ant-btn-loading');
    expect(
      screen.queryByText('order.operator.rejectFull')
    ).not.toBeInTheDocument();

    rerender(
      <OrderStep
        {...defaultProps}
        currentOrderStatus={WorkflowRecordResV1StatusEnum.wait_for_audit}
        canRejectOrder={true}
        pass={mockPass}
        stepList={waitAuditStepList}
        tasksStatusNumber={{ executing: 0, failed: 0, success: 0 }}
        currentStep={2}
        reject={mockReject}
      />
    );
    expect(screen.queryByText('order.operator.rejectFull')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByText('order.operator.rejectFull'));
    });
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    expect(getBySelector('.ant-modal')).toBeInTheDocument();
    expect(mockReject).toBeCalledTimes(0);

    fireEvent.change(screen.getByLabelText('order.operator.rejectReason'), {
      target: { value: 'test' },
    });

    fireEvent.click(screen.getAllByText('order.operator.reject')[1]);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(mockReject).toBeCalledTimes(1);
    expect(mockReject).toBeCalledWith(
      'test',
      waitAuditStepList[1].workflow_step_id
    );
    expect(
      screen.getAllByText('order.operator.reject')[1].closest('button')
    ).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getAllByText('order.operator.reject')[1].closest('button')
    ).not.toHaveClass('ant-btn-loading');
    fireEvent.click(screen.getByText('common.cancel'));
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
  });

  test('should render modify button when current order status is equal rejected and readonly is equal false', () => {
    rejectedStepList[0].operation_user_name = 'test';
    const { rerender } = render(
      <OrderStep
        {...defaultProps}
        stepList={rejectedStepList}
        currentOrderStatus={WorkflowRecordResV1StatusEnum.rejected}
      />
    );
    expect(
      screen.queryByText('order.operator.waitModifySql')
    ).toBeInTheDocument();

    rejectedStepList[0].operation_user_name = 'admin';
    rerender(
      <OrderStep
        {...defaultProps}
        stepList={rejectedStepList}
        currentOrderStatus={WorkflowRecordResV1StatusEnum.rejected}
        modifySql={mockModifySql}
      />
    );
    expect(
      screen.queryByText('order.operator.waitModifySql')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('order.operator.modifySql')).toBeInTheDocument();
    expect(mockModifySql).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('order.operator.modifySql'));
    expect(mockModifySql).toBeCalledTimes(1);
  });

  test('should render batch execute button when current order status is equal wait_for_execution', async () => {
    render(
      <OrderStep
        {...defaultProps}
        stepList={executeStepList}
        currentOrderStatus={WorkflowRecordResV1StatusEnum.wait_for_execution}
        currentStep={3}
        executing={mockExecuting}
      />
    );

    expect(
      screen.queryByText('order.operator.batchSqlExecute')
    ).toBeInTheDocument();
    expect(mockExecuting).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('order.operator.batchSqlExecute'));
    expect(
      screen.getByText('order.operator.batchSqlExecute').closest('button')
    ).toHaveClass('ant-btn-loading');

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.operator.batchSqlExecute').closest('button')
    ).not.toHaveClass('ant-btn-loading');

    expect(mockExecuting).toBeCalledTimes(1);
  });

  test('should render batch complete button when current order status is equal wait_for_execution', async () => {
    render(
      <OrderStep
        {...defaultProps}
        stepList={executeStepList}
        currentOrderStatus={WorkflowRecordResV1StatusEnum.wait_for_execution}
        currentStep={3}
        complete={mockComplete}
      />
    );

    expect(screen.queryByText('order.operator.finished')).toBeInTheDocument();
    expect(mockComplete).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('order.operator.finished'));
    expect(
      screen.getByText('order.operator.finished').closest('button')
    ).toHaveClass('ant-btn-loading');

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.operator.finished').closest('button')
    ).not.toHaveClass('ant-btn-loading');

    expect(mockComplete).toBeCalledTimes(1);
  });

  test('should disable execute button and render disable tips when the current time is not in maintenance time', () => {
    const dateNowStub = jest.fn(() => new Date('2022-07-21T12:33:37.000Z'));
    global.Date.now = dateNowStub as any;

    const { container } = render(
      <OrderStep
        {...defaultProps}
        stepList={executeStepList}
        currentOrderStatus={WorkflowRecordResV1StatusEnum.wait_for_execution}
        currentStep={3}
        executing={mockExecuting}
        maintenanceTimeInfo={[
          {
            instanceName: 'local',
            maintenanceTime: [
              {
                maintenance_start_time: { hour: 0, minute: 0 },
                maintenance_stop_time: { hour: 3, minute: 0 },
              },
            ],
          },
        ]}
      />
    );
    expect(
      screen.queryByText('order.operator.batchSqlExecute')
    ).toBeInTheDocument();
    expect(
      screen.getByText('order.operator.batchSqlExecute').closest('button')
    ).toHaveAttribute('disabled');

    expect(container).toMatchSnapshot();

    global.Date.now = realDateNow;
  });
});
