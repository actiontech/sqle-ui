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
import useRuleTemplate from '.';
import ruleTemplate from '../../api/rule_template';

describe('useRuleTemplate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(ruleTemplate, 'getRuleTemplateTipsV1');
    return spy;
  };

  test('should get role data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { rule_template_name: 'rule_template_name1', db_type: 'mysql' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.globalRuleTemplateList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateGlobalRuleTemplateSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual([
      { rule_template_name: 'rule_template_name1', db_type: 'mysql' },
    ]);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateGlobalRuleTemplateSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('rule_template_name1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { rule_template_name: 'rule_template_name1', db_type: 'mysql' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.globalRuleTemplateList).toEqual([]);

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual([
      { rule_template_name: 'rule_template_name1', db_type: 'mysql' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      resolveErrorThreeSecond([
        { rule_template_name: 'rule_template_name1', db_type: 'mysql' },
      ])
    );

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([
      {
        rule_template_name: 'rule_template_name1',
        db_type: 'mysql',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { rule_template_name: 'rule_template_name1', db_type: 'mysql' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.globalRuleTemplateList).toEqual([]);

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual([
      { rule_template_name: 'rule_template_name1', db_type: 'mysql' },
    ]);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() =>
      rejectThreeSecond([
        { rule_template_name: 'rule_template_name1', db_type: 'mysql' },
      ])
    );

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([
      {
        rule_template_name: 'rule_template_name1',
        db_type: 'mysql',
      },
    ]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.globalRuleTemplateList).toEqual([]);
  });

  test('should show one database type which your choose', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond([
        { rule_template_name: 'rule_template_name_mysql', db_type: 'mysql' },
        { rule_template_name: 'rule_template_name_oracle', db_type: 'oracle' },
      ])
    );
    const { result, waitForNextUpdate } = renderHook(() => useRuleTemplate());
    expect(result.current.loading).toBe(false);
    expect(result.current.globalRuleTemplateList).toEqual([]);

    act(() => {
      result.current.updateGlobalRuleTemplateList();
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toBeCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);

    expect(result.current.globalRuleTemplateList).toEqual([
      { rule_template_name: 'rule_template_name_mysql', db_type: 'mysql' },
      { rule_template_name: 'rule_template_name_oracle', db_type: 'oracle' },
    ]);
    cleanup();
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="rule_template_name_oracle">
        {result.current.generateGlobalRuleTemplateSelectOption('oracle')}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('rule_template_name_oracle'));
      jest.runAllTimers();
    });

    await screen.findAllByText('rule_template_name_oracle');
    expect(baseElementWithOptions).toMatchSnapshot();
  });
});
