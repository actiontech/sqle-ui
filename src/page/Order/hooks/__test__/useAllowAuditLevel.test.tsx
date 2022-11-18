import { renderHook, act } from '@testing-library/react-hooks';
import instance from '../../../../api/instance';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import { instanceWorkflowTemplate } from '../../Detail/__testData__';
import { useAllowAuditLevel } from '../useAllowAuditLevel';
import { taskInfosLeverIsError, taskInfosLeverIsNormal } from './test.data';

describe.skip('Order/useAllowAuditLevel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const mockGetInstanceWorkflowTemplate = () => {
    const spy = jest.spyOn(instance, 'getInstanceWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceWorkflowTemplate));
    return spy;
  };

  test('should return default value', () => {
    const { result } = renderHook(() => useAllowAuditLevel());
    expect(result.current.disabledOperatorOrderBtnTips).toBe('');
  });

  test('should be in line with expectations at judgeAuditLevel', async () => {
    const mockGetInstanceSpy = mockGetInstanceWorkflowTemplate();
    const setBtnDisabled = jest.fn();
    const resetBtnDisabled = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useAllowAuditLevel()
    );

    act(() => {
      result.current.judgeAuditLevel(
        taskInfosLeverIsError,
        setBtnDisabled,
        resetBtnDisabled
      );
    });

    expect(mockGetInstanceSpy).toBeCalledTimes(taskInfosLeverIsError.length);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(setBtnDisabled).toBeCalledTimes(1);
    expect(resetBtnDisabled).toBeCalledTimes(0);
    expect(result.current.disabledOperatorOrderBtnTips).toEqual(
      'order.operator.disabledOperatorOrderBtnTips'
    );

    jest.clearAllMocks();

    act(() => {
      result.current.setDisabledOperatorOrderBtnTips('');
      result.current.judgeAuditLevel(
        taskInfosLeverIsNormal,
        setBtnDisabled,
        resetBtnDisabled
      );
    });
    expect(mockGetInstanceSpy).toBeCalledTimes(taskInfosLeverIsNormal.length);
    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(setBtnDisabled).toBeCalledTimes(0);
    expect(resetBtnDisabled).toBeCalledTimes(1);
    expect(result.current.disabledOperatorOrderBtnTips).toEqual('');
  });
});
