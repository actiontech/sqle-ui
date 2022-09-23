import { act, renderHook } from '@testing-library/react-hooks';
import { WorkflowResV2ModeEnum } from '../../../api/common.enum';
import instance from '../../../api/instance';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import useModifySql from './useModifySql';
import { instanceWorkflowTemplate, taskInfo } from './__testData__';

describe('Order/useModifySql', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetInstanceWorkflowTemplate();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockGetInstanceWorkflowTemplate = () => {
    const spy = jest.spyOn(instance, 'getInstanceWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceWorkflowTemplate));
    return spy;
  };

  test('should return default value', () => {
    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.same_sqls, jest.fn())
    );
    expect(result.current.visible).toBe(false);
    expect(result.current.taskInfos).toEqual([]);
    expect(result.current.updateOrderDisabled).toBeFalsy();
  });

  test('should toggle visible value when call openModifySqlModal and closeModifySqlModal', async () => {
    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.same_sqls, jest.fn())
    );
    expect(result.current.visible).toBe(false);
    act(() => {
      result.current.openModifySqlModal();
    });
    expect(result.current.visible).toBe(true);
    act(() => {
      result.current.closeModifySqlModal();
    });
    expect(result.current.visible).toBe(false);
  });

  test('should set tempTaskId and pass rage and instance name and set visible to false when call modifySqlSubmit', async () => {
    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.same_sqls, jest.fn())
    );
    expect(result.current.visible).toBe(false);
    act(() => {
      result.current.openModifySqlModal();
    });

    expect(result.current.visible).toBe(true);
    expect(result.current.taskInfos).toEqual([]);
    act(() => {
      result.current.modifySqlSubmit([taskInfo]);
    });
    expect(result.current.visible).toBe(false);
    expect(result.current.taskInfos).toEqual([taskInfo]);
  });

  test('should reset all state when call resetAllState', () => {
    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.same_sqls, jest.fn())
    );
    expect(result.current.visible).toBe(false);
    act(() => {
      result.current.modifySqlSubmit([taskInfo]);
      result.current.openModifySqlModal();
    });
    expect(result.current.taskInfos).toEqual([taskInfo]);
    expect(result.current.visible).toBe(true);
    act(() => {
      result.current.resetAllState();
    });
    expect(result.current.visible).toBe(false);
    expect(result.current.taskInfos).toEqual([]);
  });

  test('should not close modal when sql mode is equal different', () => {
    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.different_sqls, jest.fn())
    );

    act(() => {
      result.current.openModifySqlModal();
    });
    act(() => {
      result.current.modifySqlSubmit([taskInfo]);
    });
    expect(result.current.visible).toBe(true);
  });

  test('should call setTempAuditResultActiveKey props when submit and sql mode is equal same', () => {
    const setTempAuditResultActiveKey = jest.fn();

    const { result } = renderHook(() =>
      useModifySql(WorkflowResV2ModeEnum.same_sqls, setTempAuditResultActiveKey)
    );
    act(() => {
      result.current.openModifySqlModal();
    });
    act(() => {
      result.current.modifySqlSubmit([taskInfo]);
    });

    expect(setTempAuditResultActiveKey).toBeCalledTimes(1);
    expect(setTempAuditResultActiveKey).toBeCalledWith(
      taskInfo.task_id?.toString()
    );
  });

  test('should call setTempAuditResultActiveKey props when close mode and sql mode is equal different', () => {
    const setTempAuditResultActiveKey = jest.fn();

    const { result } = renderHook(() =>
      useModifySql(
        WorkflowResV2ModeEnum.different_sqls,
        setTempAuditResultActiveKey
      )
    );
    act(() => {
      result.current.openModifySqlModal();
    });
    act(() => {
      result.current.modifySqlSubmit([taskInfo]);
    });

    act(() => {
      result.current.closeModifySqlModal([taskInfo]);
    });

    expect(setTempAuditResultActiveKey).toBeCalledTimes(1);
    expect(setTempAuditResultActiveKey).toBeCalledWith(
      taskInfo.task_id?.toString()
    );
  });
});
