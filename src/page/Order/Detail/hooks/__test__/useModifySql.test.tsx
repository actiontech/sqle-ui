import { act, renderHook } from '@testing-library/react-hooks';
import { WorkflowResV2ModeEnum } from '../../../../../api/common.enum';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import useModifySql from '../useModifySql';
import { instanceWorkflowTemplate, taskInfo } from '../../__testData__';
import {
  differenceSqlValues,
  sameSqlValues,
} from '../../../hooks/__test__/test.data';
import task from '../../../../../api/task';
import workflow from '../../../../../api/workflow';
import { useParams } from 'react-router-dom';
import { act as reactAct } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

describe('Order/useModifySql', () => {
  let createAuditTasksSpy: jest.SpyInstance;
  let auditTasksGroupIdSpy: jest.SpyInstance;
  let createAndAuditTaskSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockGetInstanceWorkflowTemplate();
    createAuditTasksSpy = mockCreateAuditTasks();
    auditTasksGroupIdSpy = mockAuditTaskGroupId();
    createAndAuditTaskSpy = mockCreateAndAuditTask();
    useParamsMock.mockReturnValue({ projectName });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

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
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceWorkflowTemplate));
    return spy;
  };

  test('should return default value', () => {
    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.same_sqls)
    );
    expect(result.current.modifySqlModalVisibility).toBe(false);
    expect(result.current.taskInfos).toEqual([]);
  });

  test('should toggle visible value when call openModifySqlModal and closeModifySqlModal', async () => {
    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.same_sqls)
    );
    expect(result.current.modifySqlModalVisibility).toBe(false);
    act(() => {
      result.current.openModifySqlModal();
    });
    expect(result.current.modifySqlModalVisibility).toBe(true);
    act(() => {
      result.current.closeModifySqlModal();
    });
    expect(result.current.modifySqlModalVisibility).toBe(false);
  });

  test('should set tempTaskId and pass rage and instance name and set visible to false when call modifySqlSubmit', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.same_sqls)
    );
    expect(createAndAuditTaskSpy).toBeCalledTimes(0);
    expect(auditTasksGroupIdSpy).toBeCalledTimes(0);
    expect(createAuditTasksSpy).toBeCalledTimes(0);

    expect(result.current.modifySqlModalVisibility).toBe(false);
    act(() => {
      result.current.openModifySqlModal();
    });

    expect(result.current.modifySqlModalVisibility).toBe(true);
    expect(result.current.taskInfos).toEqual([]);
    act(() => {
      result.current.modifySqlSubmit(sameSqlValues, 0, '');
    });
    expect(createAndAuditTaskSpy).toBeCalledTimes(0);
    expect(createAuditTasksSpy).toBeCalledTimes(1);
    await reactAct(async () => jest.advanceTimersByTime(3000));
    expect(result.current.modifySqlModalVisibility).toBe(true);
    expect(auditTasksGroupIdSpy).toBeCalledTimes(1);
    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(result.current.modifySqlModalVisibility).toBe(false);
  });

  test('should reset all state when call resetAllState', () => {
    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.same_sqls)
    );
    expect(result.current.modifySqlModalVisibility).toBe(false);
    act(() => {
      result.current.modifySqlSubmit(sameSqlValues, 0, '');
      result.current.openModifySqlModal();
    });
    expect(result.current.modifySqlModalVisibility).toBe(true);
    act(() => {
      result.current.resetAllState();
    });
    expect(result.current.modifySqlModalVisibility).toBe(false);
    expect(result.current.taskInfos).toEqual([]);
  });

  test('should not close modal when sql mode is equal different', async () => {
    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.different_sqls)
    );
    expect(createAndAuditTaskSpy).toBeCalledTimes(0);
    expect(auditTasksGroupIdSpy).toBeCalledTimes(0);
    expect(createAuditTasksSpy).toBeCalledTimes(0);

    act(() => {
      result.current.openModifySqlModal();
    });
    act(() => {
      result.current.modifySqlSubmit(differenceSqlValues, 0, '0');
    });
    expect(result.current.modifySqlModalVisibility).toBe(true);
    expect(createAndAuditTaskSpy).toBeCalledTimes(1);
    expect(createAuditTasksSpy).toBeCalledTimes(0);
    expect(auditTasksGroupIdSpy).toBeCalledTimes(0);
  });
});
