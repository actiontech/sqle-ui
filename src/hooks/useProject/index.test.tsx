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
import project from '../../api/project';
import useProject from '.';

describe('useProject', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(project, 'getProjectTipsV1');
    return spy;
  };

  test('should get project data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          project_name: 'project_name_1',
        },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useProject());
    expect(result.current.loading).toBe(false);
    expect(result.current.projectList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateProjectSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateProjectList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([
      { project_name: 'project_name_1' },
    ]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateProjectSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('project_name_1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        {
          project_name: 'project_name_1',
        },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useProject());
    expect(result.current.loading).toBe(false);
    expect(result.current.projectList).toEqual([]);

    act(() => {
      result.current.updateProjectList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([
      { project_name: 'project_name_1' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([{ project_name: 'project_name_1' }])
    );

    act(() => {
      result.current.updateProjectList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([
      {
        project_name: 'project_name_1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([{ project_name: 'project_name_1' }])
    );
    const { result, waitForNextUpdate } = renderHook(() => useProject());
    expect(result.current.loading).toBe(false);
    expect(result.current.projectList).toEqual([]);

    act(() => {
      result.current.updateProjectList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([
      { project_name: 'project_name_1' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([{ project_name: 'project_name_1' }])
    );

    act(() => {
      result.current.updateProjectList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([
      {
        project_name: 'project_name_1',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.projectList).toEqual([]);
  });
});
