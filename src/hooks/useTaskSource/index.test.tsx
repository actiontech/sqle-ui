import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup,
} from '@testing-library/react';
import {
  mockUseTaskSource,
  rejectThreeSecond,
  resolveErrorThreeSecond,
} from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useUsername from '.';

describe('useUserGroup', () => {
  let requestSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    requestSpy = mockUseTaskSource();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should get task source from request', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUsername());
    expect(result.current.loading).toBe(false);
    expect(result.current.taskSourceList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateTaskSourceSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateTaskSourceList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([{ source: 'source1' }]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateTaskSourceSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('source1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUsername());
    expect(result.current.loading).toBe(false);
    expect(result.current.taskSourceList).toEqual([]);

    act(() => {
      result.current.updateTaskSourceList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([{ source: 'source1' }]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([{ source: 'source1' }])
    );

    act(() => {
      result.current.updateTaskSourceList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([
      {
        source: 'source1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUsername());
    expect(result.current.loading).toBe(false);
    expect(result.current.taskSourceList).toEqual([]);

    act(() => {
      result.current.updateTaskSourceList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([{ source: 'source1' }]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([{ source: 'source1' }])
    );

    act(() => {
      result.current.updateTaskSourceList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([
      {
        source: 'source1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.taskSourceList).toEqual([]);
  });
});
