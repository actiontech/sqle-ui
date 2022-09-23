import { renderHook, act } from '@testing-library/react-hooks';
import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '../../../api/common.enum';
import instance from '../../../api/instance';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { instanceWorkflowTemplate } from '../Detail/__testData__';
import { useAllowAuditLevel } from './useAllowAuditLevel';

const taskInfos_error = [
  {
    instanceName: 'test1',
    currentAuditLevel:
      CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error,
  },
  {
    instanceName: 'test2',
    currentAuditLevel:
      CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal,
  },
];

const taskInfos_normal = [
  {
    instanceName: 'test3',
    currentAuditLevel:
      CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal,
  },
  {
    instanceName: 'test4',
    currentAuditLevel:
      CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal,
  },
];

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
    const setBtnDisabled = jest.fn();
    const resetBtnDisabled = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useAllowAuditLevel()
    );

    act(() => {
      result.current.judgeAuditLevel(
        taskInfos_error,
        setBtnDisabled,
        resetBtnDisabled
      );
    });

    expect(mockGetInstanceSpy).toBeCalledTimes(taskInfos_error.length);

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
        taskInfos_normal,
        setBtnDisabled,
        resetBtnDisabled
      );
    });
    expect(mockGetInstanceSpy).toBeCalledTimes(taskInfos_normal.length);
    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(setBtnDisabled).toBeCalledTimes(0);
    expect(resetBtnDisabled).toBeCalledTimes(1);
    expect(result.current.disabledOperatorOrderBtnTips).toEqual('');
  });
});
