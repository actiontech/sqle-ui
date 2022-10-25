import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks/dom';
import instance from '../../../../api/instance';
import task from '../../../../api/task';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import {
  instanceWorkflowTemplate,
  taskInfo,
  taskInfoErrorAuditLevel,
  taskInfoWarnAuditLevel,
} from '../../Detail/__testData__';
import useAuditOrder from '../useAuditOrder';
import { differenceSqlValues, sameSqlValues } from './test.data';

describe('test Order/hooks/useAuditOrder', () => {
  const mockCreateAuditTasks = () => {
    const spy = jest.spyOn(task, 'createAuditTasksV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
      })
    );
    return spy;
  };

  const mockAuditTaskGroupId = () => {
    const spy = jest.spyOn(task, 'auditTaskGroupIdV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfo],
      })
    );
    return spy;
  };

  const mockCreateAndAuditTask = () => {
    const spy = jest.spyOn(task, 'createAndAuditTaskV1');
    spy.mockImplementation(() => resolveThreeSecond(taskInfo));
    return spy;
  };

  const mockGetInstanceWorkflowTemplate = () => {
    const spy = jest.spyOn(instance, 'getInstanceWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceWorkflowTemplate));
    return spy;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should return default value', () => {
    const { result } = renderHook(() => useAuditOrder());

    expect(result.current.taskInfos).toEqual([]);
    expect(result.current.auditResultActiveKey).toBe('');
    expect(result.current.isDisableFinallySubmitButton).toBeFalsy();
    expect(result.current.disabledOperatorOrderBtnTips).toBe('');
  });

  test('use the same sql mode to audit the work order and the audit result level is normal', async () => {
    const createAuditTasksSpy = mockCreateAuditTasks();
    const auditTasksGroupIdSpy = mockAuditTaskGroupId();
    mockGetInstanceWorkflowTemplate();

    const { result } = renderHook(() => useAuditOrder());

    expect(createAuditTasksSpy).toBeCalledTimes(0);
    expect(auditTasksGroupIdSpy).toBeCalledTimes(0);

    act(() => {
      result.current.auditOrderWithSameSql(sameSqlValues);
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(createAuditTasksSpy).toBeCalledTimes(1);
    expect(createAuditTasksSpy).toBeCalledWith({
      instances: [
        {
          instance_name: 'mysql-1',
          instance_schema: 'db1',
        },
        {
          instance_name: 'mysql-2',
          instance_schema: 'db2',
        },
        {
          instance_name: 'mysql-3',
          instance_schema: 'db3',
        },
      ],
    });

    expect(auditTasksGroupIdSpy).toBeCalledTimes(1);
    expect(auditTasksGroupIdSpy).toBeCalledWith({
      task_group_id: 11,
      sql: 'SELECT (1)',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.taskInfos).toEqual([taskInfo]);

    expect(result.current.auditResultActiveKey).toBe(
      taskInfo.task_id?.toString()
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.isDisableFinallySubmitButton).toBeFalsy();
    expect(result.current.disabledOperatorOrderBtnTips).toBe('');

    auditTasksGroupIdSpy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfoErrorAuditLevel],
      })
    );

    act(() => {
      result.current.auditOrderWithSameSql(sameSqlValues);
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(createAuditTasksSpy).toBeCalledTimes(2);
    expect(auditTasksGroupIdSpy).toBeCalledTimes(2);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.taskInfos).toEqual([taskInfoErrorAuditLevel]);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.auditResultActiveKey).toBe(
      taskInfoErrorAuditLevel.task_id?.toString()
    );
    expect(result.current.isDisableFinallySubmitButton).toBeTruthy();
    expect(result.current.disabledOperatorOrderBtnTips).toBe(
      'order.operator.disabledOperatorOrderBtnTips'
    );

    act(() => {
      result.current.resetFinallySubmitButtonStatus();
    });
    expect(result.current.isDisableFinallySubmitButton).toBeFalsy();
    expect(result.current.disabledOperatorOrderBtnTips).toBe('');
  });

  test('use the difference sql mode to audit the work order', async () => {
    mockGetInstanceWorkflowTemplate();
    const createAndAuditTaskSpy = mockCreateAndAuditTask();
    expect(createAndAuditTaskSpy).toBeCalledTimes(0);
    const { result } = renderHook(() => useAuditOrder());

    //add task1
    act(() => {
      result.current.auditOrderWthDifferenceSql(differenceSqlValues, 0, '0');
    });
    expect(createAndAuditTaskSpy).toBeCalledTimes(1);
    expect(createAndAuditTaskSpy).toBeCalledWith({
      instance_name: 'mysql-1',
      instance_schema: 'db1',
      sql: 'SELECT (1)',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.taskInfos).toEqual([taskInfo]);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.isDisableFinallySubmitButton).toBeFalsy();
    expect(result.current.disabledOperatorOrderBtnTips).toBe('');

    //add task 2
    createAndAuditTaskSpy.mockImplementation(() =>
      resolveThreeSecond(taskInfoErrorAuditLevel)
    );
    act(() => {
      result.current.auditOrderWthDifferenceSql(differenceSqlValues, 1, '2');
    });
    expect(createAndAuditTaskSpy).toBeCalledTimes(2);
    expect(createAndAuditTaskSpy).toBeCalledWith({
      instance_name: 'mysql-2',
      instance_schema: 'db2',
      sql: 'SELECT (2)',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.taskInfos).toEqual([
      taskInfo,
      taskInfoErrorAuditLevel,
    ]);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.isDisableFinallySubmitButton).toBeTruthy();
    expect(result.current.disabledOperatorOrderBtnTips).toBe(
      'order.operator.disabledOperatorOrderBtnTips'
    );

    //add task 3
    createAndAuditTaskSpy.mockImplementation(() =>
      resolveThreeSecond(taskInfoWarnAuditLevel)
    );
    act(() => {
      result.current.auditOrderWthDifferenceSql(differenceSqlValues, 2, '3');
    });
    expect(createAndAuditTaskSpy).toBeCalledTimes(3);
    expect(createAndAuditTaskSpy).toBeCalledWith({
      instance_name: 'mysql-3',
      instance_schema: 'db3',
      sql: 'SELECT (3)',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.taskInfos).toEqual([
      taskInfo,
      taskInfoErrorAuditLevel,
      taskInfoWarnAuditLevel,
    ]);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.isDisableFinallySubmitButton).toBeTruthy();
    expect(result.current.disabledOperatorOrderBtnTips).toBe(
      'order.operator.disabledOperatorOrderBtnTips'
    );

    // replace task 2
    act(() => {
      result.current.auditOrderWthDifferenceSql(differenceSqlValues, 1, '2');
    });
    expect(createAndAuditTaskSpy).toBeCalledTimes(4);
    expect(createAndAuditTaskSpy).toBeCalledWith({
      instance_name: 'mysql-2',
      instance_schema: 'db2',
      sql: 'SELECT (2)',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.taskInfos).toEqual([
      taskInfo,
      taskInfoWarnAuditLevel,
      taskInfoWarnAuditLevel,
    ]);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.isDisableFinallySubmitButton).toBeFalsy();
    expect(result.current.disabledOperatorOrderBtnTips).toBe('');

    //clear task info by key
    act(() => {
      result.current.clearTaskInfoWithKey('0');
    });
    expect(result.current.taskInfos).toEqual([
      taskInfoWarnAuditLevel,
      taskInfoWarnAuditLevel,
    ]);

    //clear all task info
    act(() => {
      result.current.clearDifferenceSqlModeTaskInfos();
    });
    expect(result.current.taskInfos).toEqual([]);
  });
});
