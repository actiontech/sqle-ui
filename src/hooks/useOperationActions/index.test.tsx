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
import { IOperationActionList } from '../../api/common';

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

  const mockList: IOperationActionList[] = [
    {
      operation_type: 'project',
      operation_action: 'create_project',
      desc: '创建项目',
    },
    {
      operation_type: 'instance',
      operation_action: 'delete_instance',
      desc: '删除数据源',
    },
    {
      operation_type: 'audit_plan',
      operation_action: 'create_audit_plan',
      desc: '创建智能扫描任务',
    },
  ];

  test('should get group data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() => resolveThreeSecond(mockList));
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
    expect(result.current.operationActions).toEqual(mockList);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateOperationActionSelectOption('project')}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('创建项目');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() => resolveThreeSecond(mockList));
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
    expect(result.current.operationActions).toEqual(mockList);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() => resolveErrorThreeSecond(mockList));

    act(() => {
      result.current.updateOperationActions();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual(mockList);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() => resolveThreeSecond(mockList));
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
    expect(result.current.operationActions).toEqual(mockList);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() => rejectThreeSecond(mockList));

    act(() => {
      result.current.updateOperationActions();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual(mockList);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.operationActions).toEqual([]);
  });
});
