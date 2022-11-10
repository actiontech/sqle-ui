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
import user_group from '../../api/user_group';

describe('useUserGroup', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(user_group, 'getUserGroupTipListV1');
    return spy;
  };

  test('should get group data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([{ user_group_name: 'group1' }])
    );
    const { result, waitForNextUpdate } = renderHook(() => useUsername());
    expect(result.current.loading).toBe(false);
    expect(result.current.userGroupList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateUserGroupSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateUserGroupList('test');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(requestSpy).toBeCalledWith({
      filter_project: 'test',
    });
    expect(result.current.userGroupList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.userGroupList).toEqual([
      { user_group_name: 'group1' },
    ]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateUserGroupSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('group1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([{ user_group_name: 'group1' }])
    );
    const { result, waitForNextUpdate } = renderHook(() => useUsername());
    expect(result.current.loading).toBe(false);
    expect(result.current.userGroupList).toEqual([]);

    act(() => {
      result.current.updateUserGroupList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.userGroupList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.userGroupList).toEqual([
      { user_group_name: 'group1' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([{ user_group_name: 'group1' }])
    );

    act(() => {
      result.current.updateUserGroupList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.userGroupList).toEqual([
      {
        user_group_name: 'group1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.userGroupList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([{ user_group_name: 'group1' }])
    );
    const { result, waitForNextUpdate } = renderHook(() => useUsername());
    expect(result.current.loading).toBe(false);
    expect(result.current.userGroupList).toEqual([]);

    act(() => {
      result.current.updateUserGroupList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.userGroupList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.userGroupList).toEqual([
      { user_group_name: 'group1' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([{ user_group_name: 'group1' }])
    );

    act(() => {
      result.current.updateUserGroupList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.userGroupList).toEqual([
      {
        user_group_name: 'group1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.userGroupList).toEqual([]);
  });
});
