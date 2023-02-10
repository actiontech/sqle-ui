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
import useOperationContents from '.';
import OperationRecord from '../../api/OperationRecord';

describe('useOperationContents', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(OperationRecord, 'getOperationActionList');
    return spy;
  };

  test('should get group data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { operation_action: 'operation_action', desc: '操作内容' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationContents()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationActions).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateOperationActionSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateOperationActions();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([
      { operation_action: 'operation_action', desc: '操作内容' },
    ]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateOperationActionSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('操作内容');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { operation_action: 'operation_action', desc: '操作内容' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationContents()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationActions).toEqual([]);

    act(() => {
      result.current.updateOperationActions();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([
      { operation_action: 'operation_action', desc: '操作内容' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([
        { operation_action: 'operation_action', desc: '操作内容' },
      ])
    );

    act(() => {
      result.current.updateOperationActions();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([
      { operation_action: 'operation_action', desc: '操作内容' },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { operation_action: 'operation_action', desc: '操作内容' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationContents()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationActions).toEqual([]);

    act(() => {
      result.current.updateOperationActions();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([
      { operation_action: 'operation_action', desc: '操作内容' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([
        { operation_action: 'operation_action', desc: '操作内容' },
      ])
    );

    act(() => {
      result.current.updateOperationActions();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([
      { operation_action: 'operation_action', desc: '操作内容' },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);
  });
});
