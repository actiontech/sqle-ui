import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import BaseInfoForm from '.';
import { mockDriver } from '../../../../testUtils/mockRequest';
import { selectCustomOptionByClassName } from '../../../../testUtils/customQuery';

describe('ruleTemplate/RuleTemplateForm/BaseInfoForm', () => {
  const projectName = 'default';

  let getDriverNameListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getDriverNameListSpy = mockDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should reset all fields when user click reset button and isUpdate of props is not true', async () => {
    const { result } = renderHook(() => useForm());
    expect(getDriverNameListSpy).toBeCalledTimes(0);
    render(
      <BaseInfoForm
        form={result.current[0]}
        submit={jest.fn()}
        projectName={projectName}
        mode="create"
      />
    );
    expect(getDriverNameListSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName'),
      { target: { value: 'templateName' } }
    );
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      { target: { value: 'template describe' } }
    );
    selectCustomOptionByClassName(
      'ruleTemplate.ruleTemplateForm.databaseType',
      'database-type-logo-wrapper',
      1
    );

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('common.reset'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc')
    ).toHaveValue('');
  });

  test('should reset desc and instance fields when user click reset button and isUpdate of props is true', async () => {
    const { result } = renderHook(() => useForm());
    render(
      <BaseInfoForm
        form={result.current[0]}
        submit={jest.fn()}
        defaultData={{}}
        projectName={projectName}
        mode="create"
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    await act(() => {
      result.current[0].setFieldsValue({
        templateName: 'name1',
        db_type: 'mysql',
      });
    });

    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveAttribute('disabled');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('name1');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.databaseType')
    ).toHaveAttribute('disabled');
    expect(screen.getByText('mysql')).toBeInTheDocument();

    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      { target: { value: 'template describe' } }
    );

    fireEvent.click(screen.getByText('common.reset'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('name1');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc')
    ).toHaveValue('');

    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.databaseType')
    ).toHaveValue('');
  });

  test('should disabled db type when mode is import', async () => {
    const { result } = renderHook(() => useForm());
    render(
      <BaseInfoForm
        form={result.current[0]}
        submit={jest.fn()}
        mode="import"
        defaultData={{}}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.databaseType')
    ).toBeDisabled();
  });
});
