import RuleManagerModal from '.';
import {
  fireEvent,
  screen,
  waitFor,
  render,
  cleanup,
} from '@testing-library/react';
import { ruleData, ruleDataNoValue, editRuleData } from './__testData__';

describe('RuleSelect/RuleManagerModal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  test('should render base form at init', async () => {
    const submitFunction = jest.fn();
    const { baseElement } = render(
      <RuleManagerModal
        visible={true}
        ruleData={ruleData}
        setVisibleFalse={jest.fn()}
        submit={submitFunction}
      />
    );
    expect(baseElement).toMatchSnapshot();

    const ruleName: HTMLElement = screen.getByLabelText(
      'ruleTemplate.editModal.ruleNameLabel'
    );
    expect(ruleName).toHaveValue(ruleData.rule_name);
    expect(ruleName).toBeDisabled();

    expect(screen.getByTitle('ruleTemplate.ruleLevel.error')).toHaveTextContent(
      'ruleTemplate.ruleLevel.error'
    );

    const ruleDesc: HTMLElement = screen.getByLabelText(
      'ruleTemplate.editModal.ruleDescLabel'
    );
    expect(ruleDesc).toHaveValue(ruleData.desc);
    expect(ruleDesc).toBeDisabled();

    const ruleType: HTMLElement = screen.getByLabelText(
      'ruleTemplate.editModal.ruleTypeLabel'
    );
    expect(ruleType).toHaveValue(ruleData.type);
    expect(ruleType).toBeDisabled();

    const ruleValue: HTMLElement = screen.getByLabelText(
      'ruleTemplate.editModal.ruleLevelValue'
    );
    expect(ruleValue).toHaveValue(ruleData.value);
    fireEvent.mouseDown(
      screen.getByLabelText('ruleTemplate.editModal.ruleLevelLabel')
    );
    const option = screen.getAllByText('ruleTemplate.ruleLevel.normal')[0];
    expect(screen.getAllByText('ruleTemplate.ruleLevel.normal')[0]).toHaveClass(
      'ant-select-item-option-content'
    );
    fireEvent.click(option);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const value = {
      target: { value: 'test' },
    };
    fireEvent.change(ruleValue, value);
    await waitFor(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(ruleValue).toHaveValue('test');
    expect(
      screen.getAllByText('ruleTemplate.ruleLevel.normal')[0]
    ).toHaveTextContent('ruleTemplate.ruleLevel.normal');
    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(submitFunction).toBeCalledTimes(1);
    expect(submitFunction).toBeCalledWith(editRuleData);
  });

  test('should not show value input while ruleData not have value', () => {
    const { baseElement } = render(
      <RuleManagerModal
        visible={true}
        ruleData={ruleDataNoValue}
        setVisibleFalse={jest.fn()}
        submit={jest.fn()}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleLevelValue')
    ).toHaveValue('');
    expect(screen.getByTestId('hidden-form-item')).toHaveClass(
      'ant-form-item-hidden'
    );
  });
  test('should resetFiled while click close', async () => {
    const setVisibleFalse = jest.fn();
    const { baseElement } = render(
      <RuleManagerModal
        visible={true}
        ruleData={ruleData}
        setVisibleFalse={setVisibleFalse}
        submit={jest.fn()}
      />
    );
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseDown(
      screen.getByLabelText('ruleTemplate.editModal.ruleLevelLabel')
    );
    const option = screen.getAllByText('ruleTemplate.ruleLevel.normal')[0];
    expect(screen.getAllByText('ruleTemplate.ruleLevel.normal')[0]).toHaveClass(
      'ant-select-item-option-content'
    );
    fireEvent.click(option);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const value = {
      target: { value: 'test' },
    };
    fireEvent.change(
      screen.getByLabelText('ruleTemplate.editModal.ruleLevelValue'),
      value
    );
    await waitFor(() => {
      jest.advanceTimersByTime(1000);
    });
    fireEvent.click(screen.getByText('common.close'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleNameLabel')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleDescLabel')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleTypeLabel')
    ).toHaveValue('');
    expect(
      screen.getAllByText('ruleTemplate.editModal.ruleLevelLabelPlace')[0]
    ).toHaveClass('ant-select-selection-placeholder');
    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleLevelValue')
    ).toHaveValue('');
    expect(setVisibleFalse).toBeCalledTimes(1);
  });
});
