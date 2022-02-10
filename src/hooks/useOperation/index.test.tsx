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
import useOperation from '.';
import operation from '../../api/operation';

describe('useOperation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const operationCodes = [
    { op_code: '20100', op_desc: '查看工单' },
    { op_code: '20150', op_desc: '查看他人创建的工单' },
    { op_code: '20200', op_desc: '更新工单' },
    { op_code: '20300', op_desc: '创建工单' },
    { op_code: '20400', op_desc: '删除工单' },
  ];

  const mockRequest = () => {
    const spy = jest.spyOn(operation, 'GetOperationsV1');
    spy.mockImplementation(() => resolveThreeSecond(operationCodes));
    return spy;
  };

  test('should get role data from request', async () => {
    const requestSpy = mockRequest();
    const { result, waitForNextUpdate } = renderHook(() => useOperation());
    expect(result.current.loading).toBe(false);
    expect(result.current.operationList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateOperationSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateOperationList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual(operationCodes);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateOperationSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('查看他人创建的工单');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    const { result, waitForNextUpdate } = renderHook(() => useOperation());
    expect(result.current.loading).toBe(false);
    expect(result.current.operationList).toEqual([]);

    act(() => {
      result.current.updateOperationList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual(operationCodes);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond(operationCodes)
    );

    act(() => {
      result.current.updateOperationList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual(operationCodes);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    const { result, waitForNextUpdate } = renderHook(() => useOperation());
    expect(result.current.loading).toBe(false);
    expect(result.current.operationList).toEqual([]);

    act(() => {
      result.current.updateOperationList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual(operationCodes);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() => rejectThreeSecond(operationCodes));

    act(() => {
      result.current.updateOperationList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual(operationCodes);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationList).toEqual([]);
  });
});
