import { act, renderHook } from '@testing-library/react-hooks';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import usePanelCommonRequest from '../usePanelCommonRequest';

describe('test reportStatistics/usePanelCommonRequest', () => {
  const mockSuccessServer = () => {
    const spy = jest.fn(() => Promise.resolve(resolveThreeSecond({})));
    return spy;
  };
  const mockErrorServer = () => {
    const spy = jest.fn(() => Promise.resolve(resolveErrorThreeSecond({})));
    return spy;
  };

  const mockCatchServer = () => {
    const spy = jest.fn(() => Promise.reject(new Error('error')));
    return spy;
  };
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({
      reportStatistics: { refreshFlag: false },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should be executed server and the corresponding state should be set', async () => {
    const mockOnSuccess = jest.fn();
    const serverSpy = mockSuccessServer();

    expect(serverSpy).toBeCalledTimes(0);

    const { result, waitForNextUpdate } = renderHook(() =>
      usePanelCommonRequest(serverSpy, { onSuccess: mockOnSuccess })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe('');
    expect(mockOnSuccess).toBeCalledTimes(0);
    expect(serverSpy).toBeCalledTimes(1);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe('');
    expect(mockOnSuccess).toBeCalledTimes(1);

    act(() => {
      result.current.refreshAction();
    });
    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(mockOnSuccess).toBeCalledTimes(2);
    expect(serverSpy).toBeCalledTimes(2);
  });

  test('should be set error message when the request status code is not success', async () => {
    const mockOnSuccess = jest.fn();
    const serverSpy = mockErrorServer();

    expect(serverSpy).toBeCalledTimes(0);

    const { result, waitForNextUpdate } = renderHook(() =>
      usePanelCommonRequest(serverSpy, { onSuccess: mockOnSuccess })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe('');
    expect(mockOnSuccess).toBeCalledTimes(0);
    expect(serverSpy).toBeCalledTimes(1);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe('error');
    expect(mockOnSuccess).toBeCalledTimes(0);
  });

  test('should catch the error when request was rejected', async () => {
    const mockOnSuccess = jest.fn();
    const serverSpy = mockCatchServer();

    expect(serverSpy).toBeCalledTimes(0);

    const { result, waitForNextUpdate } = renderHook(() =>
      usePanelCommonRequest(serverSpy, { onSuccess: mockOnSuccess })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe('');
    expect(mockOnSuccess).toBeCalledTimes(0);
    expect(serverSpy).toBeCalledTimes(1);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe(new Error('error').toString());
    expect(mockOnSuccess).toBeCalledTimes(0);
  });
});
