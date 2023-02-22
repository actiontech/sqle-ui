import { act, renderHook } from '@testing-library/react-hooks';
import { useParams } from 'react-router-dom';
import task from '../../../../../api/task';
import workflow from '../../../../../api/workflow';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import { order, taskInfo } from '../../__testData__';
import useInitDataWithRequest from '../useInitDataWithRequest';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});
const orderId = '1';
const projectName = 'default';

describe('test Order/Detail/useInitDataWithRequest', () => {
  let getWorkflowSpy: jest.SpyInstance;
  let getTaskSpy: jest.SpyInstance;

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    useParamsMock.mockReturnValue({ orderId, projectName });
    getWorkflowSpy = mockGetWorkflow();
    getTaskSpy = mockGetTask();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetWorkflow = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowV2');
    spy.mockImplementation(() => resolveThreeSecond(order));
    return spy;
  };

  const mockGetTask = () => {
    const spy = jest.spyOn(task, 'getAuditTaskV1');
    spy.mockImplementation(() => resolveThreeSecond(taskInfo));
    return spy;
  };

  test('should return default value', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useInitDataWithRequest()
    );
    expect(result.current.initLoading).toBeTruthy();
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({
      workflow_id: orderId,
      project_name: projectName,
    });
    expect(getTaskSpy).toBeCalledTimes(0);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(result.current.initLoading).toBeTruthy();

    expect(result.current.orderInfo).toEqual(order);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(result.current.initLoading).toBeFalsy();

    expect(getTaskSpy).toBeCalledTimes(order.record?.tasks?.length!);
    expect(getTaskSpy).toBeCalledWith({
      task_id: `${order.record?.tasks?.[0]?.task_id!}`,
    });

    expect(result.current.taskInfos).toEqual([taskInfo]);
  });

  test('should called request when modifying refresh flag', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useInitDataWithRequest()
    );
    expect(getWorkflowSpy).toBeCalledTimes(1);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(getTaskSpy).toBeCalledTimes(order.record?.tasks?.length!);

    act(() => {
      result.current.refreshOrder();
    });
    expect(getWorkflowSpy).toBeCalledTimes(2);

    act(() => {
      result.current.refreshTask();
    });

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(getTaskSpy).toBeCalledTimes(order.record?.tasks?.length! * 2);
  });
});
