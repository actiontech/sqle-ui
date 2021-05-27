import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import useModifySql from './useModifySql';

describe('Order/useModifySql', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return default value', () => {
    const { result } = renderHook(() => useModifySql());
    expect(result.current.visible).toBe(false);
    expect(result.current.tempTaskId).toBe(undefined);
    expect(result.current.tempPassRate).toBe(undefined);
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

  test('should set tempTaskId and pass rage and set visible to false when call modifySqlSubmit', async () => {
    const { result } = renderHook(() => useModifySql());
    expect(result.current.visible).toBe(false);
    act(() => {
      result.current.openModifySqlModal();
    });

    expect(result.current.visible).toBe(true);
    expect(result.current.tempTaskId).toBe(undefined);
    expect(result.current.tempPassRate).toBe(undefined);
    act(() => {
      result.current.modifySqlSubmit(111, 222);
    });

    expect(result.current.tempTaskId).toBe(111);
    expect(result.current.tempPassRate).toBe(222);
    expect(result.current.visible).toBe(false);
  });

  test('should reset all state when call resetAllState', () => {
    const { result } = renderHook(() => useModifySql());
    expect(result.current.visible).toBe(false);
    act(() => {
      result.current.modifySqlSubmit(111, 222);
      result.current.openModifySqlModal();
    });
    expect(result.current.tempTaskId).toBe(111);
    expect(result.current.tempPassRate).toBe(222);
    expect(result.current.visible).toBe(true);
    act(() => {
      result.current.resetAllState();
    });
    expect(result.current.visible).toBe(false);
    expect(result.current.tempTaskId).toBe(undefined);
    expect(result.current.tempPassRate).toBe(undefined);
  });
});
