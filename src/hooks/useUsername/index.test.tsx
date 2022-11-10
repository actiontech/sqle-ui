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
import useUsername from '.';
import user from '../../api/user';

describe('useUsername', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(user, 'getUserTipListV1');
    return spy;
  };

  test('should get username data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([{ user_name: 'user_name1' }])
    );
    const { result, waitForNextUpdate } = renderHook(() => useUsername());
    expect(result.current.loading).toBe(false);
    expect(result.current.usernameList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateUsernameSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateUsernameList('test1');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(requestSpy).toBeCalledWith({
      filter_project: 'test1',
    });
    expect(result.current.usernameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.usernameList).toEqual([{ user_name: 'user_name1' }]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateUsernameSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('user_name1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([{ user_name: 'user_name1' }])
    );
    const { result, waitForNextUpdate } = renderHook(() => useUsername());
    expect(result.current.loading).toBe(false);
    expect(result.current.usernameList).toEqual([]);

    act(() => {
      result.current.updateUsernameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.usernameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.usernameList).toEqual([{ user_name: 'user_name1' }]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([{ user_name: 'user_name1' }])
    );

    act(() => {
      result.current.updateUsernameList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.usernameList).toEqual([
      {
        user_name: 'user_name1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.usernameList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([{ user_name: 'user_name1' }])
    );
    const { result, waitForNextUpdate } = renderHook(() => useUsername());
    expect(result.current.loading).toBe(false);
    expect(result.current.usernameList).toEqual([]);

    act(() => {
      result.current.updateUsernameList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.usernameList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.usernameList).toEqual([{ user_name: 'user_name1' }]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([{ user_name: 'user_name1' }])
    );

    act(() => {
      result.current.updateUsernameList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.usernameList).toEqual([
      {
        user_name: 'user_name1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.usernameList).toEqual([]);
  });
});
