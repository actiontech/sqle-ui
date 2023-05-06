import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup,
} from '@testing-library/react';
import {
  mockDriver,
  rejectThreeSecond,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useDatabaseType from '.';
import { driverMeta } from './index.test.data';

describe('hooks/useDatabaseType', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should get driver from request', async () => {
    const requestSpy = mockDriver();
    requestSpy.mockImplementation(() => resolveThreeSecond([driverMeta[1]]));
    const { result, waitForNextUpdate } = renderHook(() => useDatabaseType());
    expect(result.current.loading).toBeFalsy();
    expect(result.current.driverNameList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateDriverSelectOptions()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateDriverNameList();
    });
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.loading).toBeTruthy();
    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(result.current.loading).toBeFalsy();
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual(['mysql']);
    expect(result.current.driverMeta).toEqual([driverMeta[1]]);
    cleanup();
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateDriverSelectOptions()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('mysql');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockDriver();
    requestSpy.mockImplementation(() => resolveThreeSecond([driverMeta[1]]));
    const { result, waitForNextUpdate } = renderHook(() => useDatabaseType());
    expect(result.current.loading).toBe(false);
    expect(result.current.driverNameList).toEqual([]);

    act(() => {
      result.current.updateDriverNameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual(['mysql']);
    expect(result.current.driverMeta).toEqual([driverMeta[1]]);

    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([driverMeta[1]])
    );

    act(() => {
      result.current.updateDriverNameList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual(['mysql']);
    expect(result.current.driverMeta).toEqual([driverMeta[1]]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual([]);
    expect(result.current.driverMeta).toEqual([]);
  });
  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockDriver();
    requestSpy.mockImplementation(() => resolveThreeSecond([driverMeta[1]]));
    const { result, waitForNextUpdate } = renderHook(() => useDatabaseType());
    expect(result.current.loading).toBe(false);
    expect(result.current.driverNameList).toEqual([]);
    expect(result.current.driverMeta).toEqual([]);

    act(() => {
      result.current.updateDriverNameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual([]);
    expect(result.current.driverMeta).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual(['mysql']);
    expect(result.current.driverMeta).toEqual([driverMeta[1]]);

    requestSpy.mockClear();
    requestSpy.mockImplementation(() => rejectThreeSecond([driverMeta[1]]));

    act(() => {
      result.current.updateDriverNameList();
    });
    expect(result.current.loading).toBeTruthy();
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual(['mysql']);
    expect(result.current.driverMeta).toEqual([driverMeta[1]]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual([]);
    expect(result.current.driverMeta).toEqual([]);
  });
});
