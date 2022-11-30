import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BaseForm from '.';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '../../../../api/common.enum';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';

const projectName = 'default';

describe('WorkflowTemplateForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    const { container, rerender } = render(
      <BaseForm
        nextStep={jest.fn()}
        updateBaseInfo={jest.fn()}
        projectName={projectName}
      />
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
        projectName={projectName}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should reset all fields when user click rest button', async () => {
    const { container } = render(
      <BaseForm
        nextStep={jest.fn()}
        updateBaseInfo={jest.fn()}
        projectName={projectName}
      />
    );

    selectOptionByIndex(
      'workflowTemplate.form.label.allowSubmitWhenLessAuditLevel',
      'workflowTemplate.auditLevel.warn',
      1
    );

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getByText('common.reset'));
    expect(container).toMatchSnapshot();
  });

  test('should reset audit level when user click reset button and prop have defaultData field', async () => {
    const { container } = render(
      <BaseForm
        nextStep={jest.fn()}
        updateBaseInfo={jest.fn()}
        defaultData={{
          allow_submit_when_less_audit_level:
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.notice,
        }}
        projectName={projectName}
      />
    );
    expect(
      screen.getAllByText('workflowTemplate.auditLevel.notice')[0]
    ).toHaveClass('ant-select-selection-item');
    fireEvent.click(screen.getByText('common.reset'));
    expect(container).toMatchSnapshot();
  });
});
