import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import ProgressConfig from '.';
import { IWorkflowTemplateDetailResV1 } from '../../../../api/common';
import EmitterKey from '../../../../data/EmitterKey';
import { getBySelector } from '../../../../testUtils/customQuery';
import { renderWithTheme } from '../../../../testUtils/customRender';
import { mockUseUsername } from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import { workflowData } from '../../__testData__';

const projectName = 'default';
describe('progressConfig', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseUsername();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  test('should match snapshot without default data', () => {
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={jest.fn()}
        projectName={projectName}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot with default data', () => {
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={jest.fn()}
        defaultData={workflowData as IWorkflowTemplateDetailResV1}
        projectName={projectName}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should update username and remove error tips if error exist when user select a user in someone review step', async () => {
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={jest.fn()}
        projectName={projectName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.click(screen.getByText('common.submit'));
    expect(container).toMatchSnapshot();
    fireEvent.input(screen.getByTestId('review-desc-0'), {
      target: { value: 'desc1' },
    });
    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('review-user-0')
      )
    );

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption = screen.getAllByText('user_name1');
    const username = usernameOption[1];
    expect(username).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username);

    expect(container).toMatchSnapshot();
  });

  test('should update username and remove error tips if error exist when user select a user in exec step', async () => {
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={jest.fn()}
        projectName={projectName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('common.submit'));
    expect(container).toMatchSnapshot();
    fireEvent.input(screen.getByTestId('exec-user-desc'), {
      target: { value: 'desc1' },
    });

    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('exec-user-select')
      )
    );

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption = screen.getAllByText('user_name1');
    const username = usernameOption[1];
    expect(username).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username);

    expect(container).toMatchSnapshot();
  });

  test('should remove step and remove error step index if step which was removed is a error step', async () => {
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={jest.fn()}
        projectName={projectName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.click(screen.getByText('common.submit'));
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    expect(container).toMatchSnapshot();
    fireEvent.click(
      screen.getAllByText('workflowTemplate.progressConfig.operator.remove')[0]
    );

    expect(container).toMatchSnapshot();
  });

  test('should move a step and step error index if step which was moved is a error step', async () => {
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={jest.fn()}
        projectName={projectName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.input(screen.getByTestId('review-desc-0'), {
      target: { value: 'desc1' },
    });
    fireEvent.click(screen.getByText('common.submit'));
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getAllByTestId('move-up')[1]);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getAllByTestId('move-down')[0]);
    expect(container).toMatchSnapshot();
  });

  test('should validate step and update progress config when user click submit button', async () => {
    const submitProgressConfigFn = jest.fn();
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={submitProgressConfigFn}
        projectName={projectName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.input(screen.getByTestId('review-desc-0'), {
      target: { value: 'desc0' },
    });
    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('review-user-0')
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption = screen.getAllByText('user_name1');
    const username = usernameOption[1];
    expect(username).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username);

    fireEvent.input(screen.getByTestId('review-desc-1'), {
      target: { value: 'desc1' },
    });
    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('review-user-1')
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption1 = screen.getAllByText('user_name1');
    const username1 = usernameOption1[4];
    expect(username1).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username1);

    fireEvent.input(screen.getByTestId('review-desc-2'), {
      target: { value: 'desc2' },
    });
    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('review-user-2')
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption2 = screen.getAllByText('user_name1');
    const username2 = usernameOption2[7];
    expect(username2).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username2);

    fireEvent.click(screen.getByText('common.submit'));
    expect(submitProgressConfigFn).not.toBeCalled();

    fireEvent.input(screen.getByTestId('exec-user-desc'), {
      target: { value: 'desc exec' },
    });
    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('exec-user-select')
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption3 = screen.getAllByText('user_name1');
    const username3 = usernameOption3[10];
    expect(username3).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username3);

    fireEvent.click(screen.getByText('common.submit'));
    expect(submitProgressConfigFn).toBeCalledTimes(1);
    expect(submitProgressConfigFn).toBeCalledWith([
      {
        assignee_user_name_list: ['user_name1'],
        desc: 'desc0',
        type: 'sql_review',
        approved_by_authorized: false,
        execute_by_authorized: false,
      },
      {
        assignee_user_name_list: ['user_name1'],
        desc: 'desc1',
        type: 'sql_review',
        approved_by_authorized: false,
        execute_by_authorized: false,
      },
      {
        assignee_user_name_list: ['user_name1'],
        desc: 'desc2',
        type: 'sql_review',
        approved_by_authorized: false,
        execute_by_authorized: false,
      },
      {
        assignee_user_name_list: ['user_name1'],
        desc: 'desc exec',
        type: 'sql_execute',
      },
    ]);

    fireEvent.click(screen.getByText('common.reset'));
    expect(container).toMatchSnapshot();
  });

  test('should reset all fields when dispatch reset workflow template form event', async () => {
    const submitProgressConfigFn = jest.fn();
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={submitProgressConfigFn}
        projectName={projectName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.input(screen.getByTestId('review-desc-0'), {
      target: { value: 'desc0' },
    });
    fireEvent.click(screen.getByText('common.submit'));
    expect(container).toMatchSnapshot();
    act(() => {
      EventEmitter.emit(EmitterKey.Reset_Workflow_Template_Form);
    });
    expect(container).toMatchSnapshot();
  });

  test('should set approved_by_authorized to true when user select review user type to match', async () => {
    const submitProgressConfigFn = jest.fn();
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={submitProgressConfigFn}
        projectName={projectName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.input(screen.getByTestId('review-desc-0'), {
      target: { value: 'desc0' },
    });

    fireEvent.click(screen.getByText('common.submit'));
    expect(submitProgressConfigFn).not.toBeCalled();
    expect(container).toMatchSnapshot();

    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('review-user-0')
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption = screen.getAllByText('user_name1');
    const username = usernameOption[1];
    expect(username).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username);

    fireEvent.click(
      screen.getByText(
        'workflowTemplate.progressConfig.review.reviewUserType.matchAudit'
      )
    );

    fireEvent.input(screen.getByTestId('exec-user-desc'), {
      target: { value: 'desc exec' },
    });
    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('exec-user-select')
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption3 = screen.getAllByText('user_name1');

    const username1 = usernameOption3[3];
    expect(username1).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username1);

    fireEvent.click(screen.getByText('common.submit'));
    expect(submitProgressConfigFn).toBeCalledTimes(1);
    expect(submitProgressConfigFn).toBeCalledWith([
      {
        assignee_user_name_list: [],
        desc: 'desc0',
        type: 'sql_review',
        approved_by_authorized: true,
        execute_by_authorized: false,
      },
      {
        assignee_user_name_list: ['user_name1'],
        desc: 'desc exec',
        type: 'sql_execute',
      },
    ]);

    fireEvent.click(screen.getByText('common.reset'));
    expect(container).toMatchSnapshot();
  });
  test('should set execute_by_authorized to true when user select execute user type to match', async () => {
    const submitProgressConfigFn = jest.fn();
    const { container } = renderWithTheme(
      <ProgressConfig
        submitLoading={false}
        prevStep={jest.fn()}
        submitProgressConfig={submitProgressConfigFn}
        projectName={projectName}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(
      screen.getByText('workflowTemplate.progressConfig.operator.addReview')
    );
    fireEvent.input(screen.getByTestId('review-desc-0'), {
      target: { value: 'desc0' },
    });

    fireEvent.click(screen.getByText('common.submit'));
    expect(submitProgressConfigFn).not.toBeCalled();
    expect(container).toMatchSnapshot();

    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('review-user-0')
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption = screen.getAllByText('user_name1');
    const username = usernameOption[1];
    expect(username).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username);

    fireEvent.click(
      screen.getByText(
        'workflowTemplate.progressConfig.review.reviewUserType.matchExecute'
      )
    );

    fireEvent.input(screen.getByTestId('exec-user-desc'), {
      target: { value: 'desc exec' },
    });
    fireEvent.mouseDown(
      getBySelector(
        '.ant-select-selection-placeholder',
        screen.getByTestId('exec-user-select')
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const usernameOption3 = screen.getAllByText('user_name1');

    const username1 = usernameOption3[3];
    expect(username1).toHaveClass('ant-select-item-option-content');
    fireEvent.click(username1);

    fireEvent.click(screen.getByText('common.submit'));
    expect(submitProgressConfigFn).toBeCalledTimes(1);
    expect(submitProgressConfigFn).toBeCalledWith([
      {
        assignee_user_name_list: [],
        desc: 'desc0',
        type: 'sql_review',
        approved_by_authorized: false,
        execute_by_authorized: true,
      },
      {
        assignee_user_name_list: ['user_name1'],
        desc: 'desc exec',
        type: 'sql_execute',
      },
    ]);

    fireEvent.click(screen.getByText('common.reset'));
    expect(container).toMatchSnapshot();
  });
});
