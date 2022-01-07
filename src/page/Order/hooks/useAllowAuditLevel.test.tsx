import { renderHook, act } from '@testing-library/react-hooks';
import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '../../../api/common.enum';
import instance from '../../../api/instance';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { instanceWorkflowTemplate } from '../Detail/__testData__';
import { useAllowAuditLevel } from './useAllowAuditLevel';
describe('Order/useAllowAuditLevel', () => {
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
    const setCreateOrderDisabled = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useAllowAuditLevel()
    );

    act(() => {
      result.current.judgeAuditLevel(
        'test',
        setCreateOrderDisabled,
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error
      );
    });

    expect(mockGetInstanceSpy).toBeCalledTimes(1);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(setCreateOrderDisabled).toBeCalledTimes(1);
    expect(result.current.disabledOperatorOrderBtnTips).toEqual(
      'order.operator.disabledOperatorOrderBtnTips'
    );

    jest.clearAllMocks();

    act(() => {
      result.current.setDisabledOperatorOrderBtnTips('');
      result.current.judgeAuditLevel(
        'test',
        setCreateOrderDisabled,
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal
      );
    });
    expect(mockGetInstanceSpy).toBeCalledTimes(1);
    jest.advanceTimersByTime(3000);
    expect(setCreateOrderDisabled).toBeCalledTimes(0);
    expect(result.current.disabledOperatorOrderBtnTips).toEqual('');
  });
});
