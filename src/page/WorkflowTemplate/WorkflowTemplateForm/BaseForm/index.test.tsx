import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BaseForm from '.';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '../../../../api/common.enum';
import { mockUseInstance } from '../../../../testUtils/mockRequest';

describe.skip('WorkflowTemplateForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseInstance();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    const { container, rerender } = render(
      <BaseForm nextStep={jest.fn()} updateBaseInfo={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <BaseForm
        nextStep={jest.fn()}
        updateBaseInfo={jest.fn()}
        defaultData={{
          workflow_template_name: 'name1',
          desc: 'desc1',
          instance_name_list: ['name1'],
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should reset all fields when user click rest button', async () => {
    const { container } = render(
      <BaseForm nextStep={jest.fn()} updateBaseInfo={jest.fn()} />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.input(screen.getByLabelText('workflowTemplate.form.label.name'), {
      target: { value: 'name1' },
    });
    fireEvent.input(screen.getByLabelText('workflowTemplate.form.label.desc'), {
      target: { value: 'desc' },
    });

    fireEvent.mouseDown(
      screen.getByLabelText('workflowTemplate.form.label.instanceNameList')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);

    fireEvent.click(screen.getByText('common.reset'));
    expect(container).toMatchSnapshot();
  });

  test('should reset desc and instance name list when user click reset button and prop have defaultData field', async () => {
    render(
      <BaseForm
        nextStep={jest.fn()}
        updateBaseInfo={jest.fn()}
        defaultData={{
          workflow_template_name: 'name1',
          desc: 'desc1',
          allow_submit_when_less_audit_level:
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.notice,
          instance_name_list: ['instance1'],
        }}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('common.reset'));
    expect(
      screen.getByLabelText('workflowTemplate.form.label.name')
    ).toHaveAttribute('value', 'name1');
  });

  test('should validate field and call updateBaseInfo when user click next step button', async () => {
    const nextStepFn = jest.fn();
    const updateBaseInfoFn = jest.fn();
    render(
      <BaseForm nextStep={nextStepFn} updateBaseInfo={updateBaseInfoFn} />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.input(screen.getByLabelText('workflowTemplate.form.label.name'), {
      target: { value: 'name1' },
    });
    fireEvent.input(screen.getByLabelText('workflowTemplate.form.label.desc'), {
      target: { value: 'desc' },
    });

    fireEvent.mouseDown(
      screen.getByLabelText(
        'workflowTemplate.form.label.allowSubmitWhenLessAuditLevel'
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const levelOptions = screen.getAllByText(
      'workflowTemplate.auditLevel.warn'
    );
    const level = levelOptions[1];
    expect(level).toHaveClass('ant-select-item-option-content');
    fireEvent.click(level);

    fireEvent.mouseDown(
      screen.getByLabelText('workflowTemplate.form.label.instanceNameList')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    fireEvent.click(screen.getByText('common.nextStep'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(nextStepFn).toBeCalledTimes(1);
    expect(updateBaseInfoFn).toBeCalledWith({
      name: 'name1',
      desc: 'desc',
      allowSubmitWhenLessAuditLevel:
        WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
      instanceNameList: ['instance1'],
    });
  });
});
