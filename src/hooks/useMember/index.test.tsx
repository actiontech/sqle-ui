import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup,
} from '@testing-library/react';
import {
  mockUseMember,
  rejectThreeSecond,
  resolveErrorThreeSecond,
} from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useMember from '.';

describe('useMember', () => {
  let requestSpy: jest.SpyInstance;
  beforeEach(() => {
    requestSpy = mockUseMember();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should get member tips data from request', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMember());
    expect(result.current.loading).toBe(false);
    expect(result.current.memberList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateMemberSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateMemberList('test1');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(requestSpy).toBeCalledWith({
      project_name: 'test1',
    });
    expect(result.current.memberList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.memberList).toEqual([{ user_name: 'member1' }]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateMemberSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('member1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMember());
    expect(result.current.loading).toBe(false);
    expect(result.current.memberList).toEqual([]);

    act(() => {
      result.current.updateMemberList('test');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.memberList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.memberList).toEqual([{ user_name: 'member1' }]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([{ user_name: 'member1' }])
    );

    act(() => {
      result.current.updateMemberList('test');
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.memberList).toEqual([
      {
        user_name: 'member1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.memberList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMember());
    expect(result.current.loading).toBe(false);
    expect(result.current.memberList).toEqual([]);

    act(() => {
      result.current.updateMemberList('test');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.memberList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.memberList).toEqual([{ user_name: 'member1' }]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([{ user_name: 'member1' }])
    );

    act(() => {
      result.current.updateMemberList('test');
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.memberList).toEqual([
      {
        user_name: 'member1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.memberList).toEqual([]);
  });
});
