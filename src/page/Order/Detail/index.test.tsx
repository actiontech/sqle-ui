import Order from '.';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import workflow from '../../../api/workflow';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import {
  orderWithHistory,
  order,
  taskInfo,
  taskSqls,
  orderCancel,
  orderReject,
  orderPass,
} from './__testData__';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import task from '../../../api/task';
import { act } from 'react-dom/test-utils';
import {
  getAllBySelector,
  getBySelector,
} from '../../../testUtils/customQuery';
import { SupportTheme } from '../../../theme';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

// https://github.com/react-monaco-editor/react-monaco-editor/issues/176
jest.mock('react-monaco-editor', () => {
  return (props: any) => <input {...props} />;
});

describe('Order/Detail', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    useParamsMock.mockReturnValue({ orderId: '1' });
    mockUseSelector({ user: { username: 'admin', theme: SupportTheme.LIGHT } });
    mockUseDispatch();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  const mockGetWorkflow = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowV1');
    spy.mockImplementation(() => resolveThreeSecond(order));
    return spy;
  };

  const mockGetTask = () => {
    const spy = jest.spyOn(task, 'getAuditTaskV1');
    spy.mockImplementation(() => resolveThreeSecond(taskInfo));
    return spy;
  };

  const mockGetTaskSqls = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV1');
    spy.mockImplementation(() => resolveThreeSecond(taskSqls));
    return spy;
  };

  const mockCreateTask = () => {
    const spy = jest.spyOn(task, 'createAndAuditTaskV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        pass_rate: 0.2,
        task_id: 33,
      })
    );
    return spy;
  };

  const mockGetSqlContent = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLContentV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        sql: 'old sql',
      })
    );
    return spy;
  };

  test('should render on process order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    const { container } = renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(order.record.task_id),
    });

    expect(container).toMatchSnapshot();
  });

  test('should render close order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderCancel));
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderCancel.record.task_id),
    });
    expect(
      screen.queryByText('order.closeOrder.button')?.parentNode
    ).toHaveAttribute('hidden');
    expect(screen.queryByText('order.status.canceled')).toBeInTheDocument();
  });

  test('should render reject order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderReject.record.task_id),
    });

    expect(screen.queryByText('order.closeOrder.button')).toBeInTheDocument();
    expect(screen.queryByText('order.status.reject')).toBeInTheDocument();
  });

  test('should render pass order info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderPass));
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderPass.record.task_id),
    });
    expect(
      screen.queryByText('order.closeOrder.button')?.parentNode
    ).toHaveAttribute('hidden');
    expect(screen.queryByText('order.status.finished')).toBeInTheDocument();
  });

  test('should render process order with order step history info by request', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() =>
      resolveThreeSecond(orderWithHistory)
    );
    const getTaskSpy = mockGetTask();
    mockGetTaskSqls();
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({ workflow_id: 1 });
    expect(getTaskSpy).not.toBeCalled();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSpy).toBeCalledTimes(1);
    expect(getTaskSpy).toBeCalledWith({
      task_id: String(orderWithHistory.record.task_id),
    });

    expect(screen.queryByText('order.closeOrder.button')).toBeInTheDocument();
    expect(screen.queryByText('order.history.showHistory')).toBeInTheDocument();
    expect(screen.queryByText('order.status.process')).toBeInTheDocument();
  });

  test('should send resolve order request when click resolve button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    mockGetTask();
    mockGetTaskSqls();

    const resolveOrderSpy = jest.spyOn(workflow, 'approveWorkflowV1');
    resolveOrderSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('order.operator.sqlExecute')).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.operator.sqlExecute'));
    expect(resolveOrderSpy).toBeCalledTimes(1);
    expect(resolveOrderSpy).toBeCalledWith({
      workflow_id: String(order.workflow_id),
      workflow_step_id: String(
        order.record.workflow_step_list[order.record.current_step_number - 1]
          .workflow_step_id
      ),
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getWorkflowSpy).toBeCalledTimes(2);
    expect(
      screen.queryByText('order.operator.approveSuccessTips')
    ).toBeInTheDocument();
  });

  test('should send reject order request when click reject button', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    mockGetTask();
    mockGetTaskSqls();

    const rejectOrderSpy = jest.spyOn(workflow, 'rejectWorkflowV1');
    rejectOrderSpy.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(<Order />);
    expect(getWorkflowSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      fireEvent.click(screen.getByText('order.operator.reject'));
    });

    fireEvent.input(screen.getByLabelText('order.operator.rejectReason'), {
      target: { value: 'test reason' },
    });

    const modalOperatorButtons = getAllBySelector(
      'button',
      getBySelector('.ant-modal')
    );
    const rejectButton = modalOperatorButtons[0];
    expect(rejectButton).toHaveAttribute('type', 'submit');
    expect(rejectButton).toHaveTextContent('order.operator.reject');

    fireEvent.click(rejectButton);

    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });

    expect(rejectOrderSpy).toBeCalledTimes(1);
    expect(rejectOrderSpy).toBeCalledWith({
      reason: 'test reason',
      workflow_id: String(order.workflow_id),
      workflow_step_id: String(
        order.record.workflow_step_list[order.record.current_step_number - 1]
          .workflow_step_id
      ),
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getWorkflowSpy).toBeCalledTimes(2);
    expect(
      screen.queryByText('order.operator.rejectSuccessTips')
    ).toBeInTheDocument();
  });

  test('should get new sql audit result when update audit sql', async () => {
    const getWorkflowSpy = mockGetWorkflow();
    getWorkflowSpy.mockImplementation(() => resolveThreeSecond(orderReject));
    const getTaskSpy = mockGetTask();
    const createTaskSpy = mockCreateTask();
    const getTaskSqlSpy = mockGetTaskSqls();
    const getSqlContentSpy = mockGetSqlContent();
    const { container } = renderWithThemeAndRouter(<Order />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('order.operator.modifySql'));
    expect(screen.queryByText('order.modifySql.title')).toBeInTheDocument();
    expect(getSqlContentSpy).toBeCalledTimes(1);
    expect(getSqlContentSpy).toBeCalledWith({
      task_id: String(taskInfo.task_id),
    });
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue(
      '/* input your sql */'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue('old sql');
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'new sql' },
    });
    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    expect(createTaskSpy).toBeCalledWith({
      instance_name: 'db1',
      sql: 'new sql',
    });
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(getTaskSqlSpy).toBeCalledTimes(1);

    expect(getTaskSqlSpy).toBeCalledTimes(2);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    // expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
    //   'ant-btn-loading'
    // );
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    expect(container).toMatchSnapshot();
  });
});
