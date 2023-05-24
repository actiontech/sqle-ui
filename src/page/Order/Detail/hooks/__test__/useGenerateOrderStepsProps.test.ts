import { screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';
import { IGetWorkflowTasksItemV2 } from '../../../../../api/common';
import { GetWorkflowTasksItemV2StatusEnum } from '../../../../../api/common.enum';
import workflow from '../../../../../api/workflow';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import useGenerateOrderStepsProps from '../useGenerateOrderStepsProps';

describe('test Order/Detail/useGenerateOrderStepsProps', () => {
  const refreshOrder = jest.fn();
  const refreshTask = jest.fn();
  const refreshOverviewAction = jest.fn();
  const workflowId = '1';
  const stepId = 1;
  const reason = 'reason';
  const projectName = 'default';

  const workflowTasks: IGetWorkflowTasksItemV2[] = [
    {
      current_step_assignee_user_name_list: ['admin1'],
      exec_end_time: '2022-09-30',
      exec_start_time: '2022-09-01',
      instance_name: 'mysql-1',
      status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
      task_id: 27,
      task_pass_rate: 0.3099,
      task_score: 30,
      instance_maintenance_times: [
        {
          maintenance_start_time: { hour: 3, minute: 0 },
          maintenance_stop_time: { hour: 10, minute: 0 },
        },
      ],
    },
  ];

  const hooksParam = {
    workflowId,
    refreshOrder,
    refreshTask,
    refreshOverviewAction,
    projectName,
  };

  let approveWorkflowSpy: jest.SpyInstance;
  let executeTasksOnWorkflowSpy: jest.SpyInstance;
  let rejectWorkflowSpy: jest.SpyInstance;
  let batchCompleteWorkflowSpy: jest.SpyInstance;
  let terminateMultipleTaskByWorkflowSpy: jest.SpyInstance;

  beforeEach(() => {
    approveWorkflowSpy = mockApproveWorkflow();
    executeTasksOnWorkflowSpy = mockExecuteTasksOnWorkflow();
    rejectWorkflowSpy = mockRejectWorkflow();
    batchCompleteWorkflowSpy = mockBatchCompleteWorkflow();
    terminateMultipleTaskByWorkflowSpy = mockTerminateMultipleTaskByWorkflow();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockApproveWorkflow = () => {
    const spy = jest.spyOn(workflow, 'approveWorkflowV2');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockExecuteTasksOnWorkflow = () => {
    const spy = jest.spyOn(workflow, 'executeTasksOnWorkflowV2');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockTerminateMultipleTaskByWorkflow = () => {
    const spy = jest.spyOn(workflow, 'terminateMultipleTaskByWorkflowV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockRejectWorkflow = () => {
    const spy = jest.spyOn(workflow, 'rejectWorkflowV2');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockBatchCompleteWorkflow = () => {
    const spy = jest.spyOn(workflow, 'batchCompleteWorkflowsV2');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should return default value', () => {
    const { result } = renderHook(() => useGenerateOrderStepsProps(hooksParam));

    expect(result.current.maintenanceTimeInfo).toEqual([]);
    expect(result.current.tasksStatusNumber).toBeUndefined();
    expect(refreshOrder).toBeCalledTimes(0);
    expect(refreshTask).toBeCalledTimes(0);
    expect(refreshOverviewAction).toBeCalledTimes(0);
  });

  test('should be call refreshOrder and refreshOverviewAction when executed pass', async () => {
    const { result } = renderHook(() => useGenerateOrderStepsProps(hooksParam));
    expect(approveWorkflowSpy).toBeCalledTimes(0);

    result.current.pass(stepId);
    expect(approveWorkflowSpy).toBeCalledTimes(1);
    expect(approveWorkflowSpy).toBeCalledWith({
      workflow_id: workflowId,
      workflow_step_id: `${stepId}`,
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.operator.approveSuccessTips')
    ).toBeInTheDocument();
    expect(refreshOrder).toBeCalledTimes(1);
    expect(refreshTask).toBeCalledTimes(0);
    expect(refreshOverviewAction).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
  });

  test('should be call refreshOrder, refreshTask and refreshOverviewAction when executed executing', async () => {
    const { result } = renderHook(() => useGenerateOrderStepsProps(hooksParam));
    expect(executeTasksOnWorkflowSpy).toBeCalledTimes(0);

    result.current.executing();
    expect(executeTasksOnWorkflowSpy).toBeCalledTimes(1);
    expect(executeTasksOnWorkflowSpy).toBeCalledWith({
      workflow_id: workflowId,
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.operator.executingTips')
    ).toBeInTheDocument();
    expect(refreshOrder).toBeCalledTimes(1);
    expect(refreshTask).toBeCalledTimes(1);
    expect(refreshOverviewAction).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
  });

  test('should be call refreshOrder, refreshTask and refreshOverviewAction when executed terminate', async () => {
    const { result } = renderHook(() => useGenerateOrderStepsProps(hooksParam));
    expect(terminateMultipleTaskByWorkflowSpy).toBeCalledTimes(0);

    result.current.terminate();
    expect(terminateMultipleTaskByWorkflowSpy).toBeCalledTimes(1);
    expect(terminateMultipleTaskByWorkflowSpy).toBeCalledWith({
      workflow_id: workflowId,
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.operator.terminateSuccessTips')
    ).toBeInTheDocument();
    expect(refreshOrder).toBeCalledTimes(1);
    expect(refreshTask).toBeCalledTimes(1);
    expect(refreshOverviewAction).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
  });

  test('should be call refreshOrder and refreshOverviewAction when executed reject', async () => {
    const { result } = renderHook(() => useGenerateOrderStepsProps(hooksParam));
    expect(rejectWorkflowSpy).toBeCalledTimes(0);

    result.current.reject(reason, stepId);

    expect(rejectWorkflowSpy).toBeCalledTimes(1);
    expect(rejectWorkflowSpy).toBeCalledWith({
      workflow_id: workflowId,
      workflow_step_id: `${stepId}`,
      project_name: projectName,
      reason,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.operator.rejectSuccessTips')
    ).toBeInTheDocument();
    expect(refreshOrder).toBeCalledTimes(1);
    expect(refreshTask).toBeCalledTimes(0);
    expect(refreshOverviewAction).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
  });

  test('should be call refreshOrder, refreshTask and refreshOverviewAction when executed complete', async () => {
    const { result } = renderHook(() => useGenerateOrderStepsProps(hooksParam));
    expect(batchCompleteWorkflowSpy).toBeCalledTimes(0);

    result.current.complete();
    expect(batchCompleteWorkflowSpy).toBeCalledTimes(1);
    expect(batchCompleteWorkflowSpy).toBeCalledWith({
      workflow_id_list: [workflowId],
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.operator.completeSuccessTips')
    ).toBeInTheDocument();
    expect(refreshOrder).toBeCalledTimes(1);
    expect(refreshTask).toBeCalledTimes(1);
    expect(refreshOverviewAction).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
  });

  test('should set can reject order and set maintenance times when executed getOverviewListSuccessHandle', () => {
    const { result } = renderHook(() => useGenerateOrderStepsProps(hooksParam));
    const succeededTask = cloneDeep(workflowTasks[0]);
    succeededTask.status = GetWorkflowTasksItemV2StatusEnum.exec_succeeded;

    const executingTask = cloneDeep(workflowTasks[0]);
    executingTask.status = GetWorkflowTasksItemV2StatusEnum.executing;

    const failedTask = cloneDeep(workflowTasks[0]);
    failedTask.status = GetWorkflowTasksItemV2StatusEnum.exec_failed;

    act(() => {
      result.current.getOverviewListSuccessHandle(workflowTasks);
    });

    expect(result.current.maintenanceTimeInfo).toEqual([
      {
        instanceName: 'mysql-1',
        maintenanceTime: [
          {
            maintenance_start_time: { hour: 3, minute: 0 },
            maintenance_stop_time: { hour: 10, minute: 0 },
          },
        ],
      },
    ]);
    expect(result.current.canRejectOrder).toBeTruthy();
    expect(result.current.tasksStatusNumber).toEqual({
      failed: 0,
      success: 0,
      executing: 0,
    });

    act(() => {
      result.current.getOverviewListSuccessHandle([
        ...workflowTasks,
        succeededTask,
        succeededTask,
        executingTask,
        failedTask,
        failedTask,
        failedTask,
      ]);
    });
    expect(result.current.tasksStatusNumber).toEqual({
      failed: 3,
      success: 2,
      executing: 1,
    });
  });
});
