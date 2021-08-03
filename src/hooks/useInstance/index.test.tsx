import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup,
} from '@testing-library/react';
import useInstance from '.';
import instance from '../../api/instance';
import {
  rejectThreeSecond,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';
import { Select } from 'antd';

describe('useInstance', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(instance, 'getInstanceTipListV1');
    return spy;
  };

  test('should get instance data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { instance_name: 'instance_test_name', instance_type: 'mysql' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useInstance());
    expect(result.current.loading).toBe(false);
    expect(result.current.instanceList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateInstanceSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateInstanceList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([
      { instance_name: 'instance_test_name', instance_type: 'mysql' },
    ]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateInstanceSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('instance_test_name');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { instance_name: 'instance_test_name', instance_type: 'mysql' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useInstance());
    expect(result.current.loading).toBe(false);
    expect(result.current.instanceList).toEqual([]);

    act(() => {
      result.current.updateInstanceList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([
      { instance_name: 'instance_test_name', instance_type: 'mysql' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([
        { instance_name: 'instance_test_name', instance_type: 'mysql' },
      ])
    );

    act(() => {
      result.current.updateInstanceList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([
      {
        instance_name: 'instance_test_name',
        instance_type: 'mysql',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([{ instance_name: 'instance_test_name' }])
    );
    const { result, waitForNextUpdate } = renderHook(() => useInstance());
    expect(result.current.loading).toBe(false);
    expect(result.current.instanceList).toEqual([]);

    act(() => {
      result.current.updateInstanceList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([
      { instance_name: 'instance_test_name' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([{ instance_name: 'instance_test_name' }])
    );

    act(() => {
      result.current.updateInstanceList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([
      {
        instance_name: 'instance_test_name',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([]);
  });

  test('should show one database type which your choose', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { instance_name: 'mysql_instance_test_name', instance_type: 'mysql' },
        { instance_name: 'oracle_instance_test_name', instance_type: 'oracle' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useInstance());
    expect(result.current.loading).toBe(false);
    expect(result.current.instanceList).toEqual([]);

    act(() => {
      result.current.updateInstanceList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.instanceList).toEqual([
      { instance_name: 'mysql_instance_test_name', instance_type: 'mysql' },
      { instance_name: 'oracle_instance_test_name', instance_type: 'oracle' },
    ]);
    cleanup();
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="oracle_instance_test_name">
        {result.current.generateInstanceSelectOption('oracle')}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('oracle_instance_test_name'));
      jest.runAllTimers();
    });

    await screen.findAllByText('oracle_instance_test_name');
    expect(baseElementWithOptions).toMatchSnapshot();
  });
});
