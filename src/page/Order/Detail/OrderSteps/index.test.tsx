import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import moment from 'moment';
import { act } from 'react-dom/test-utils';
import OrderSteps from '.';
import { IWorkflowResV1 } from '../../../../api/common';
import { getBySelector } from '../../../../testUtils/customQuery';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import {
  order,
  order3,
  orderCancel,
  orderCancel3,
  orderPass,
  orderPass3,
  orderReject,
  orderReject3,
  orderWithExecScheduled,
  orderWithExecScheduled3,
  orderWithExecuting,
  orderWithExecuting3,
  execScheduleSubmit3,
} from '../__testData__';

describe.skip('Order/Detail/OrderSteps', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { username: 'admin' } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match to snapshot when user is assignee user', () => {
    const { rerender, container } = render(
      <OrderSteps
        currentStep={order.record?.current_step_number}
        stepList={order.record?.workflow_step_list ?? []}
        pass={jest.fn()}
        reject={jest.fn()}
        modifySql={jest.fn()}
        executing={jest.fn()}
        execSchedule={jest.fn()}
        currentOrderStatus={order.record?.status}
      />
    );
    expect(container).toMatchSnapshot();
    const data: IWorkflowResV1[] = [
      orderCancel,
      orderReject,
      orderPass,
      order3,
      orderCancel3,
      orderReject3,
      orderPass3,
      orderWithExecScheduled,
      orderWithExecScheduled3,
      orderWithExecuting,
      orderWithExecuting3,
      execScheduleSubmit3,
    ];
    data.forEach((item) => {
      rerender(
        <OrderSteps
          currentStep={item.record?.current_step_number}
          stepList={item.record?.workflow_step_list ?? []}
          scheduleTime={item.record?.schedule_time}
          scheduledUser={item.record?.schedule_user}
          pass={jest.fn()}
          reject={jest.fn()}
          modifySql={jest.fn()}
          executing={jest.fn()}
          execSchedule={jest.fn()}
          currentOrderStatus={order.record?.status}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  test('should match to snapshot when user is not assignee user', () => {
    mockUseSelector({ user: { username: 'test' } });
    const { rerender, container } = render(
      <OrderSteps
        currentStep={order.record?.current_step_number}
        stepList={order.record?.workflow_step_list ?? []}
        scheduleTime={order.record?.schedule_time}
        scheduledUser={order.record?.schedule_user}
        pass={jest.fn()}
        reject={jest.fn()}
        execSchedule={jest.fn()}
        executing={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={order.record?.status}
      />
    );
    expect(container).toMatchSnapshot();
    const data: IWorkflowResV1[] = [
      orderCancel,
      orderReject,
      orderPass,
      order3,
      orderCancel3,
      orderReject3,
      orderPass3,
      orderWithExecScheduled,
      orderWithExecScheduled3,
      orderWithExecuting,
      orderWithExecuting3,
      execScheduleSubmit3,
    ];
    data.forEach((item) => {
      rerender(
        <OrderSteps
          currentStep={item.record?.current_step_number}
          stepList={item.record?.workflow_step_list ?? []}
          scheduleTime={order.record?.schedule_time}
          scheduledUser={order.record?.schedule_user}
          pass={jest.fn()}
          reject={jest.fn()}
          executing={jest.fn()}
          modifySql={jest.fn()}
          execSchedule={jest.fn()}
          currentOrderStatus={order.record?.status}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  test('should call pass func of props when click resolve button', async () => {
    const passMock = jest.fn().mockImplementation(() => resolveThreeSecond({}));
    render(
      <OrderSteps
        currentStep={order3.record?.current_step_number}
        stepList={order3.record?.workflow_step_list ?? []}
        scheduleTime={order.record?.schedule_time}
        scheduledUser={order.record?.schedule_user}
        pass={passMock}
        reject={jest.fn()}
        executing={jest.fn()}
        execSchedule={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={order3.record?.status}
      />
    );
    expect(screen.queryByText('order.operator.sqlReview')).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.operator.sqlReview'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('order.operator.sqlReview').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(passMock).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.operator.sqlReview').parentNode
    ).not.toHaveClass('ant-btn-loading');
  });

  test('should call reject func of props when click reject button', async () => {
    const rejectMock = jest
      .fn()
      .mockImplementation(() => resolveThreeSecond({}));
    render(
      <OrderSteps
        currentStep={order3.record?.current_step_number}
        stepList={order3.record?.workflow_step_list ?? []}
        scheduleTime={order.record?.schedule_time}
        scheduledUser={order.record?.schedule_user}
        pass={jest.fn()}
        reject={rejectMock}
        executing={jest.fn()}
        execSchedule={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={order3.record?.status}
      />
    );
    expect(screen.queryByText('order.operator.reject')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByText('order.operator.reject'));
    });
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    expect(getBySelector('.ant-modal')).toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('order.operator.rejectReason'), {
      target: { value: 'test reason' },
    });
    const rejectSubmit = getBySelector(
      '.ant-btn-primary',
      getBySelector('.ant-modal')
    );
    expect(rejectSubmit).toHaveTextContent('order.operator.reject');
    fireEvent.click(rejectSubmit);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(rejectMock).toBeCalledTimes(1);
    expect(rejectMock).toBeCalledWith('test reason', 21);
    expect(rejectSubmit).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(rejectSubmit).not.toHaveClass('ant-btn-loading');
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
  });

  test('should call execSchedule when click execSchedule button', async () => {
    const execScheduleMock = jest
      .fn()
      .mockImplementation(() => resolveThreeSecond({}));
    render(
      <OrderSteps
        currentStep={execScheduleSubmit3.record?.current_step_number}
        stepList={execScheduleSubmit3.record?.workflow_step_list ?? []}
        scheduleTime={execScheduleSubmit3.record?.schedule_time}
        scheduledUser={execScheduleSubmit3.record?.schedule_user}
        pass={jest.fn()}
        reject={jest.fn()}
        executing={jest.fn()}
        execSchedule={execScheduleMock}
        modifySql={jest.fn()}
        currentOrderStatus={execScheduleSubmit3.record?.status}
      />
    );
    expect(
      screen.queryByText('order.operator.onlineRegularly')
    ).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByText('order.operator.onlineRegularly'));
    });
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    expect(getBySelector('.ant-modal')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#schedule_time'));
    fireEvent.input(getBySelector('#schedule_time'), {
      target: {
        value: moment()
          .add(1, 'd')
          .hour(0)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DD HH:mm:ss')
          .toString(),
      },
    });
    fireEvent.click(
      getBySelector('.ant-btn-primary', getBySelector('.ant-picker-footer'))
    );
    const execScheduleSubmit = getBySelector(
      '.ant-btn-primary',
      getBySelector('.ant-modal')
    );
    expect(execScheduleSubmit).toHaveTextContent(
      'order.operator.onlineRegularly'
    );
    expect(getBySelector('#schedule_time')).toHaveValue(
      moment()
        .add(1, 'd')
        .hour(0)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DD HH:mm:ss')
        .toString()
    );
    fireEvent.click(execScheduleSubmit);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(execScheduleMock).toBeCalledTimes(1);
    expect(execScheduleMock).toBeCalledWith(
      moment()
        .add(1, 'd')
        .hour(0)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DDTHH:mm:ssZ')
        .toString()
    );
    expect(execScheduleSubmit).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(execScheduleSubmit).not.toHaveClass('ant-btn-loading');
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
  });

  test('should call executing func of props when click executing button', async () => {
    const executingMock = jest
      .fn()
      .mockImplementation(() => resolveThreeSecond({}));
    render(
      <OrderSteps
        currentStep={execScheduleSubmit3.record?.current_step_number}
        stepList={execScheduleSubmit3.record?.workflow_step_list ?? []}
        scheduleTime={execScheduleSubmit3.record?.schedule_time}
        scheduledUser={execScheduleSubmit3.record?.schedule_user}
        pass={jest.fn()}
        reject={jest.fn()}
        executing={executingMock}
        execSchedule={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={execScheduleSubmit3.record?.status}
      />
    );
    expect(screen.queryByText('order.operator.sqlExecute')).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.operator.sqlExecute'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(
      screen.getByText('order.operator.sqlExecute').parentNode
    ).toHaveClass('ant-btn-loading');
    expect(executingMock).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.operator.sqlExecute').parentNode
    ).not.toHaveClass('ant-btn-loading');
  });

  test('only can select maintenance time when user want to set sheduled time', async () => {
    const executingMock = jest
      .fn()
      .mockImplementation(() => resolveThreeSecond({}));
    const { baseElement } = render(
      <OrderSteps
        currentStep={orderWithExecScheduled3.record?.current_step_number}
        stepList={orderWithExecScheduled3.record?.workflow_step_list ?? []}
        scheduleTime={orderWithExecScheduled3.record?.schedule_time}
        scheduledUser={orderWithExecScheduled3.record?.schedule_user}
        maintenanceTime={orderWithExecScheduled3.instance_maintenance_times}
        pass={jest.fn()}
        reject={jest.fn()}
        executing={executingMock}
        execSchedule={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={execScheduleSubmit3.record?.status}
      />
    );

    expect(
      screen.getByText('order.operator.sqlExecute').parentNode
    ).toBeDisabled();
    fireEvent.click(screen.getByText('order.operator.onlineRegularly'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(baseElement).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.mouseDown(getBySelector('.ant-picker'));
    fireEvent.mouseUp(getBySelector('.ant-picker'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(getBySelector('.ant-picker-time-panel')).toMatchSnapshot();
  });

  test('user should set any time when maintenanceTime is empty', async () => {
    const nowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date('2022-06-29').getTime());
    const executingMock = jest
      .fn()
      .mockImplementation(() => resolveThreeSecond({}));
    render(
      <OrderSteps
        currentStep={orderWithExecScheduled3.record?.current_step_number}
        stepList={orderWithExecScheduled3.record?.workflow_step_list ?? []}
        pass={jest.fn()}
        reject={jest.fn()}
        executing={executingMock}
        execSchedule={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={execScheduleSubmit3.record?.status}
      />
    );

    fireEvent.click(screen.getByText('order.operator.onlineRegularly'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.mouseDown(getBySelector('.ant-picker'));
    fireEvent.mouseUp(getBySelector('.ant-picker'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getAllByText('30')[1]);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(getBySelector('.ant-picker-time-panel')).toMatchSnapshot();
    nowSpy.mockRestore();
  });

  test('should throw error when user only click today', async () => {
    render(
      <OrderSteps
        currentStep={execScheduleSubmit3.record?.current_step_number}
        stepList={execScheduleSubmit3.record?.workflow_step_list ?? []}
        pass={jest.fn()}
        reject={jest.fn()}
        executing={jest.fn()}
        execSchedule={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={execScheduleSubmit3.record?.status}
      />
    );
    expect(
      screen.queryByText('order.operator.onlineRegularly')
    ).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByText('order.operator.onlineRegularly'));
    });
    const warnSpy = jest.spyOn(console, 'warn');
    warnSpy.mockImplementation(() => void 0);
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    expect(getBySelector('.ant-modal')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#schedule_time'));
    fireEvent.click(screen.getAllByText('00')[2]);
    fireEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    expect(warnSpy).toBeCalledTimes(1);
    expect(warnSpy).toBeCalledWith('async-validator:', [
      'order.operator.execScheduledBeforeNow',
    ]);
    warnSpy.mockRestore();
  });
});
