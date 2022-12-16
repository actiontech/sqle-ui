import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks/dom';
import {
  mockDriver,
  mockUseGlobalRuleTemplate,
  mockUseProject,
  mockUseRuleTemplate,
} from '../../../testUtils/mockRequest';
import useRuleFilterForm from '../useRuleFilterForm';
import route from 'react-router';

describe('test useRuleFilterForm', () => {
  const projectName = 'default';
  const ruleTemplateName = 'rule1';
  let getDriverSpy: jest.SpyInstance;
  let getProjectSpy: jest.SpyInstance;
  let getRuleTemplateSpy: jest.SpyInstance;
  let getGlobalRuleTemplateSpy: jest.SpyInstance;
  const getProjectTemplateRulesSpy = jest.fn();
  const getGlobalTemplateRulesSpy = jest.fn();

  beforeEach(() => {
    getDriverSpy = mockDriver();
    getProjectSpy = mockUseProject();
    getRuleTemplateSpy = mockUseRuleTemplate();
    getGlobalRuleTemplateSpy = mockUseGlobalRuleTemplate();

    jest.useFakeTimers();
    jest.spyOn(route, 'useLocation').mockReturnValue({
      pathname: '/rule',
      hash: '',
      search: '',
      state: '',
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should send request get tips', async () => {
    expect(getDriverSpy).toBeCalledTimes(0);
    expect(getProjectSpy).toBeCalledTimes(0);
    expect(getRuleTemplateSpy).toBeCalledTimes(0);
    expect(getGlobalRuleTemplateSpy).toBeCalledTimes(0);
    renderHook(() =>
      useRuleFilterForm(getProjectTemplateRulesSpy, getGlobalTemplateRulesSpy)
    );

    expect(getDriverSpy).toBeCalledTimes(1);
    expect(getProjectSpy).toBeCalledTimes(1);
    expect(getRuleTemplateSpy).toBeCalledTimes(0);
    expect(getGlobalRuleTemplateSpy).toBeCalledTimes(1);
  });

  test('should set dbType default value when driverNameList length  is greater than zero', async () => {
    const { result } = renderHook(() =>
      useRuleFilterForm(getProjectTemplateRulesSpy, getGlobalTemplateRulesSpy)
    );

    expect(result.current.dbType).toBeUndefined();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.dbType).toBe('oracle');
  });

  test('should be match snapshot of rule template options', async () => {
    const { result } = renderHook(() =>
      useRuleFilterForm(getProjectTemplateRulesSpy, getGlobalTemplateRulesSpy)
    );

    expect(result.current.generateRuleTemplateSelectOptions()).toBeNull();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      result.current.generateRuleTemplateSelectOptions()
    ).toMatchSnapshot();

    act(() => {
      result.current.projectNameChangeHandle(projectName);
    });
    expect(result.current.projectName).toBe(projectName);
    expect(getRuleTemplateSpy).toBeCalledTimes(1);
    expect(getRuleTemplateSpy).toBeCalledWith({
      project_name: projectName,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      result.current.generateRuleTemplateSelectOptions()
    ).toMatchSnapshot();

    act(() => {
      result.current.projectNameChangeHandle('');
    });
    expect(getRuleTemplateSpy).toBeCalledTimes(1);
  });

  test('should clear rule template name when changed project name or changed dbType', async () => {
    const { result } = renderHook(() =>
      useRuleFilterForm(getProjectTemplateRulesSpy, getGlobalTemplateRulesSpy)
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getGlobalTemplateRulesSpy).toBeCalledTimes(0);

    act(() => {
      result.current.ruleTemplateNameChangeHandle(ruleTemplateName);
    });
    expect(result.current.ruleTemplateName).toBe(ruleTemplateName);

    expect(getProjectTemplateRulesSpy).toBeCalledTimes(0);
    expect(getGlobalTemplateRulesSpy).toBeCalledTimes(1);
    expect(getGlobalTemplateRulesSpy).toBeCalledWith(ruleTemplateName);

    act(() => {
      result.current.projectNameChangeHandle(projectName);
    });

    expect(result.current.ruleTemplateName).toBeUndefined();

    act(() => {
      result.current.ruleTemplateNameChangeHandle(ruleTemplateName);
    });
    expect(getGlobalTemplateRulesSpy).toBeCalledTimes(1);
    expect(getProjectTemplateRulesSpy).toBeCalledTimes(1);
    expect(getProjectTemplateRulesSpy).toBeCalledWith(
      projectName,
      ruleTemplateName
    );

    act(() => {
      result.current.ruleTemplateNameChangeHandle('');
    });
    expect(getGlobalTemplateRulesSpy).toBeCalledTimes(1);
    expect(getProjectTemplateRulesSpy).toBeCalledTimes(1);
  });

  test('should be executed change event with url search parameter', async () => {
    jest.spyOn(route, 'useLocation').mockReturnValue({
      pathname: '/rule',
      hash: '',
      search: `?projectName=${projectName}&ruleTemplateName=${ruleTemplateName}`,
      state: '',
    });

    const { result, rerender } = renderHook(() =>
      useRuleFilterForm(getProjectTemplateRulesSpy, getGlobalTemplateRulesSpy)
    );

    expect(result.current.projectName).toBe(projectName);
    expect(getRuleTemplateSpy).toBeCalledTimes(1);
    expect(getRuleTemplateSpy).toBeCalledWith({
      project_name: projectName,
    });

    expect(getGlobalTemplateRulesSpy).toBeCalledTimes(0);
    expect(getProjectTemplateRulesSpy).toBeCalledTimes(1);
    expect(getProjectTemplateRulesSpy).toBeCalledWith(
      projectName,
      ruleTemplateName
    );

    jest.clearAllMocks();
    jest.clearAllTimers();

    jest.spyOn(route, 'useLocation').mockReturnValue({
      pathname: '/rule',
      hash: '',
      search: `ruleTemplateName=${ruleTemplateName}`,
      state: '',
    });

    rerender();
    expect(getRuleTemplateSpy).toBeCalledTimes(0);
    expect(getProjectTemplateRulesSpy).toBeCalledTimes(0);
    expect(getGlobalTemplateRulesSpy).toBeCalledTimes(1);
    expect(getGlobalTemplateRulesSpy).toBeCalledWith(ruleTemplateName);
  });
});
