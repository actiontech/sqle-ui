import { act, renderHook } from '@testing-library/react-hooks';
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
    const { result } = renderHook(() => useModifySql());
    expect(result.current.visible).toBe(false);
    expect(result.current.taskInfo).toBe(undefined);
    expect(result.current.updateOrderDisabled).toBeFalsy();
  });

  test('should toggle visible value when call openModifySqlModal and closeModifySqlModal', async () => {
    const { result } = renderHook(() => useModifySql());
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
    const { result } = renderHook(() => useModifySql());
    expect(result.current.visible).toBe(false);
    act(() => {
      result.current.openModifySqlModal();
    });

    expect(result.current.visible).toBe(true);
    expect(result.current.taskInfo).toBe(undefined);
    act(() => {
      result.current.modifySqlSubmit(taskInfo);
    });

    expect(result.current.taskInfo).toEqual(taskInfo);
  });

  test('should reset all state when call resetAllState', () => {
    const { result } = renderHook(() => useModifySql());
    expect(result.current.visible).toBe(false);
    act(() => {
      result.current.modifySqlSubmit(taskInfo);
      result.current.openModifySqlModal();
    });
    expect(result.current.taskInfo).toEqual(taskInfo);
    expect(result.current.visible).toBe(true);
    act(() => {
      result.current.resetAllState();
    });
    expect(result.current.visible).toBe(false);
    expect(result.current.taskInfo).toBe(undefined);
  });
});
