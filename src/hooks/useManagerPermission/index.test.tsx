import {
  cleanup,
  render,
  act as reactAct,
  fireEvent,
  screen,
} from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { Select } from 'antd';
import useManagerPermission from '.';
import { IManagementPermission } from '../../api/common';
import management_permission from '../../api/management_permission';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../testUtils/mockRequest';

describe('test useManagerPermission', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const managerPermissionList: IManagementPermission[] = [
    { code: 20100, desc: '创建项目' },
    { code: 20150, desc: '修改项目' },
    { code: 20400, desc: '删除项目' },
  ];

  const mockRequest = () => {
    const spy = jest.spyOn(management_permission, 'GetManagementPermissionsV1');
    spy.mockImplementation(() => resolveThreeSecond(managerPermissionList));
    return spy;
  };

  test('should get manager permission list from request', async () => {
    const requestSpy = mockRequest();
    const { result, waitForNextUpdate } = renderHook(() =>
      useManagerPermission()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.managerPermissionList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateManagerPermissionSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateManagerPermission();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.managerPermissionList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.managerPermissionList).toEqual(managerPermissionList);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateManagerPermissionSelectOption()}
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
    const { result, waitForNextUpdate } = renderHook(() =>
      useManagerPermission()
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.managerPermissionList).toEqual([]);

    act(() => {
      result.current.updateManagerPermission();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.managerPermissionList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.managerPermissionList).toEqual(managerPermissionList);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond(managerPermissionList)
    );

    act(() => {
      result.current.updateManagerPermission();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.managerPermissionList).toEqual(managerPermissionList);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.managerPermissionList).toEqual([]);
  });
});
