import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup,
} from '@testing-library/react';
import {
  AuditPlanTypesData,
  mockUseAuditPlanTypes,
  rejectThreeSecond,
  resolveErrorThreeSecond,
} from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useAuditPlanTypes from '.';

describe('useAuditPlanTypes', () => {
  let requestSpy!: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    requestSpy = mockUseAuditPlanTypes();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should get audit plan types data from request', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuditPlanTypes());
    expect(result.current.loading).toBe(false);
    expect(result.current.auditPlanTypes).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateAuditPlanTypesOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateAuditPlanTypes();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual(AuditPlanTypesData);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateAuditPlanTypesOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('库表元数据');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuditPlanTypes());
    expect(result.current.loading).toBe(false);
    expect(result.current.auditPlanTypes).toEqual([]);

    act(() => {
      result.current.updateAuditPlanTypes();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual(AuditPlanTypesData);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([{ type: 'mysql_mybatis', desc: 'Mybatis 扫描' }])
    );

    act(() => {
      result.current.updateAuditPlanTypes();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual(AuditPlanTypesData);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuditPlanTypes());
    expect(result.current.loading).toBe(false);
    expect(result.current.auditPlanTypes).toEqual([]);

    act(() => {
      result.current.updateAuditPlanTypes();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual(AuditPlanTypesData);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([{ type: 'all_app_extract', desc: '应用程序SQL抓取' }])
    );

    act(() => {
      result.current.updateAuditPlanTypes();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual(AuditPlanTypesData);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.auditPlanTypes).toEqual([]);
  });
});
