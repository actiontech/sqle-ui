import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup,
} from '@testing-library/react';
import {
  rejectThreeSecond,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useDatabaseType from '.';
import configuration from '../../api/configuration';

describe('hooks/useDatabaseType', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(configuration, 'getDriversV1');
    return spy;
  };
  test('should get driver from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond({ driver_name_list: ['mysql'] })
    );
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
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond({ driver_name_list: ['mysql'] })
    );
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
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ driver_name_list: ['mysql'] })
    );

    act(() => {
      result.current.updateDriverNameList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual(['mysql']);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual([]);
  });
  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond({ driver_name_list: ['mysql'] })
    );
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
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond({ driver_name_list: ['mysql'] })
    );

    act(() => {
      result.current.updateDriverNameList();
    });
    expect(result.current.loading).toBeTruthy();
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual(['mysql']);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.driverNameList).toEqual([]);
  });
});
