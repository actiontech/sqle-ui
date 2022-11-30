import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import BaseInfoForm from '.';
import { mockDriver, mockUseInstance } from '../../../../testUtils/mockRequest';

describe('ruleTemplate/RuleTemplateForm/BaseInfoForm', () => {
  const projectName = 'default';

  let getDriverNameListSpy: jest.SpyInstance;
  let getInstanceListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getDriverNameListSpy = mockDriver();
    getInstanceListSpy = mockUseInstance();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should reset all fields when user click reset button and isUpdate of props is not true', async () => {
    const { result } = renderHook(() => useForm());
    expect(getDriverNameListSpy).toBeCalledTimes(0);
    expect(getInstanceListSpy).toBeCalledTimes(0);
    render(
      <BaseInfoForm
        form={result.current[0]}
        submit={jest.fn()}
        projectName={projectName}
      />
    );
    expect(getDriverNameListSpy).toBeCalledTimes(1);
    expect(getInstanceListSpy).toBeCalledTimes(1);
    expect(getInstanceListSpy).toBeCalledWith({ project_name: projectName });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName'),
      { target: { value: 'templateName' } }
    );
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      { target: { value: 'template describe' } }
    );
    fireEvent.mouseDown(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.databaseType')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const databaseTypeOption = screen.getAllByText('mysql')[1];
    expect(databaseTypeOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(databaseTypeOption);

    fireEvent.mouseDown(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.instances')
    );
    const option = screen.getAllByText('instance1')[0];
    fireEvent.click(option);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.reset'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.instances')
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
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    result.current[0].setFieldsValue({
      templateName: 'name1',
      db_type: 'mysql',
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

    fireEvent.mouseDown(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.instances')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const option = screen.getAllByText('instance1')[0];
    fireEvent.click(option);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.reset'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('name1');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.instances')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.databaseType')
    ).toHaveValue('');
  });
});
