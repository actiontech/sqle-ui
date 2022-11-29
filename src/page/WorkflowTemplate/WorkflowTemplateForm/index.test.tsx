import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import WorkflowTemplateForm from '.';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '../../../api/common.enum';
import EmitterKey from '../../../data/EmitterKey';
import {
  getBySelector,
  selectOptionByIndex,
} from '../../../testUtils/customQuery';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import {
  mockUseInstance,
  mockUseUsername,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';

const projectName = 'default';

describe('WorkflowTemplateForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseInstance();
    mockUseUsername();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithThemeAndRouter(
      <WorkflowTemplateForm
        updateBaseInfo={jest.fn()}
        submitProgress={jest.fn()}
        projectName={projectName}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should show step by step index', async () => {
    const updateBaseInfoMock = jest.fn();
    const submitProgressMock = jest.fn();
    submitProgressMock.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(
      <WorkflowTemplateForm
        updateBaseInfo={updateBaseInfoMock}
        submitProgress={submitProgressMock}
        projectName={projectName}
      >
        test id
      </WorkflowTemplateForm>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('progress-config')).toHaveAttribute('hidden');
    expect(screen.getByTestId('submit-result')).toHaveAttribute('hidden');
    selectOptionByIndex(
      'workflowTemplate.form.label.allowSubmitWhenLessAuditLevel',
      'workflowTemplate.auditLevel.warn',
      1
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.nextStep'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(updateBaseInfoMock).toBeCalledWith({
      allowSubmitWhenLessAuditLevel:
        WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
    });
    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('progress-config')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('submit-result')).toHaveAttribute('hidden');
    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('exec-user-select')
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const option = screen.getAllByText('user_name1')[1];
    fireEvent.click(option);
    expect(option).toHaveClass('ant-select-item-option-content');
    fireEvent.input(screen.getByTestId('exec-user-desc'), {
      target: { value: 'exec user' },
    });
    fireEvent.click(screen.getByText('common.submit'));
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.prevStep').parentNode).toHaveAttribute(
      'disabled'
    );
    expect(screen.getAllByText('common.reset')[1].parentNode).toHaveAttribute(
      'disabled'
    );
    expect(submitProgressMock).toBeCalledWith([
      {
        assignee_user_name_list: ['user_name1'],
        desc: 'exec user',
        type: 'sql_execute',
      },
    ]);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('progress-config')).toHaveAttribute('hidden');
    expect(screen.getByTestId('submit-result')).not.toHaveAttribute('hidden');
  });

  test('should jump to prev step when user click prev button', async () => {
    const updateBaseInfoMock = jest.fn();
    const submitProgressMock = jest.fn();
    submitProgressMock.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(
      <WorkflowTemplateForm
        updateBaseInfo={updateBaseInfoMock}
        submitProgress={submitProgressMock}
        projectName={projectName}
      >
        test id
      </WorkflowTemplateForm>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('progress-config')).toHaveAttribute('hidden');
    expect(screen.getByTestId('submit-result')).toHaveAttribute('hidden');
    selectOptionByIndex(
      'workflowTemplate.form.label.allowSubmitWhenLessAuditLevel',
      'workflowTemplate.auditLevel.warn',
      1
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.nextStep'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('progress-config')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('submit-result')).toHaveAttribute('hidden');

    fireEvent.click(screen.getByText('common.prevStep'));
    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('progress-config')).toHaveAttribute('hidden');
    expect(screen.getByTestId('submit-result')).toHaveAttribute('hidden');
  });

  test('should jump to first step when dispatch reset workflow template form event', async () => {
    const updateBaseInfoMock = jest.fn();
    const submitProgressMock = jest.fn();
    submitProgressMock.mockImplementation(() => resolveThreeSecond({}));
    renderWithThemeAndRouter(
      <WorkflowTemplateForm
        updateBaseInfo={updateBaseInfoMock}
        submitProgress={submitProgressMock}
        projectName={projectName}
      >
        test id
      </WorkflowTemplateForm>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('progress-config')).toHaveAttribute('hidden');
    expect(screen.getByTestId('submit-result')).toHaveAttribute('hidden');
    selectOptionByIndex(
      'workflowTemplate.form.label.allowSubmitWhenLessAuditLevel',
      'workflowTemplate.auditLevel.warn',
      1
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.nextStep'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('progress-config')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('submit-result')).toHaveAttribute('hidden');

    act(() => {
      EventEmitter.emit(EmitterKey.Reset_Workflow_Template_Form);
    });

    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('progress-config')).toHaveAttribute('hidden');
    expect(screen.getByTestId('submit-result')).toHaveAttribute('hidden');
  });
});
