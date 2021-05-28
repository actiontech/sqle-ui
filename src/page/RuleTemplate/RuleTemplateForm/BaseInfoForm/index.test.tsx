import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'antd/lib/form/Form';
import { act } from 'react-dom/test-utils';
import BaseInfoForm from '.';
import { mockUseInstance } from '../../../../testUtils/mockRequest';

describe('ruleTemplate/RuleTemplateForm/BaseInfoForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseInstance();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should reset all fields when user click reset button and isUpdate of props is not true', async () => {
    const { result } = renderHook(() => useForm());
    render(<BaseInfoForm form={result.current[0]} submit={jest.fn()} />);
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
        isUpdate={true}
        submit={jest.fn()}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      result.current[0].setFieldsValue({ templateName: 'name1' });
    });

    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveAttribute('disabled');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('name1');
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      { target: { value: 'template describe' } }
    );
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
    ).toHaveValue('name1');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.instances')
    ).toHaveValue('');
  });
});
