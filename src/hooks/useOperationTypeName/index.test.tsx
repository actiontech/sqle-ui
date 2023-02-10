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
import useOperationTypeName from '.';
import OperationRecord from '../../api/OperationRecord';

describe('useOperationTypeName', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(OperationRecord, 'GetOperationTypeNameList');
    return spy;
  };

  test('should get group data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { operation_type_name: 'operation_type_name1', desc: '操作类型' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationTypeName()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationTypeNameList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateOperationTypeNameSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateOperationTypeNameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([
      { operation_type_name: 'operation_type_name1', desc: '操作类型' },
    ]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateOperationTypeNameSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('操作类型');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { operation_type_name: 'operation_type_name1', desc: '操作类型' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationTypeName()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationTypeNameList).toEqual([]);

    act(() => {
      result.current.updateOperationTypeNameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([
      { operation_type_name: 'operation_type_name1', desc: '操作类型' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([{ operation_type_name: 'operation_type_name1' }])
    );

    act(() => {
      result.current.updateOperationTypeNameList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([
      { operation_type_name: 'operation_type_name1', desc: '操作类型' },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { operation_type_name: 'operation_type_name1', desc: '操作类型' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useOperationTypeName()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.operationTypeNameList).toEqual([]);

    act(() => {
      result.current.updateOperationTypeNameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([
      { operation_type_name: 'operation_type_name1', desc: '操作类型' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([
        { operation_type_name: 'operation_type_name1', desc: '操作类型' },
      ])
    );

    act(() => {
      result.current.updateOperationTypeNameList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([
      { operation_type_name: 'operation_type_name1', desc: '操作类型' },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationTypeNameList).toEqual([]);
  });
});
