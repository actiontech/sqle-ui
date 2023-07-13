import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup,
} from '@testing-library/react';
import {
  mockUseRuleType,
  rejectThreeSecond,
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useRuleType from '.';

describe('useRuleType', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const ruleTypes = [
    {
      rule_count: 0,
      rule_type: 'DML1',
    },
    {
      rule_count: 3,
      rule_type: 'DML2',
    },
  ];

  test('should get ruleTypeList data from request', async () => {
    const requestSpy = mockUseRuleType();
    requestSpy.mockImplementation(() => resolveThreeSecond(ruleTypes));
    const { result, waitForNextUpdate } = renderHook(() => useRuleType());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTypeList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateRuleTypeSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateRuleTypeList('oracle');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(requestSpy).toBeCalledWith({
      db_type: 'oracle',
    });
    expect(result.current.ruleTypeList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateRuleTypeSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('DML1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockUseRuleType();
    requestSpy.mockImplementation(() => resolveThreeSecond(ruleTypes));
    const { result, waitForNextUpdate } = renderHook(() => useRuleType());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTypeList).toEqual([]);

    act(() => {
      result.current.updateRuleTypeList('oracle');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() => resolveErrorThreeSecond(ruleTypes));

    act(() => {
      result.current.updateRuleTypeList('oracle');
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockUseRuleType();
    requestSpy.mockImplementation(() => resolveThreeSecond(ruleTypes));
    const { result, waitForNextUpdate } = renderHook(() => useRuleType());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTypeList).toEqual([]);

    act(() => {
      result.current.updateRuleTypeList('mysql');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() => rejectThreeSecond(ruleTypes));

    act(() => {
      result.current.updateRuleTypeList('mysql');
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual([]);
  });
});
