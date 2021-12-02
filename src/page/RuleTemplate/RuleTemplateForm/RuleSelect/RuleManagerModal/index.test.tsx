import RuleManagerModal from '.';
import {
  fireEvent,
  screen,
  waitFor,
  render,
  cleanup,
} from '@testing-library/react';
import { ruleData, editRuleData } from './__testData__';

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

    expect(
      screen.queryByLabelText('ruleTemplate.editModal.ruleNameLabel')
    ).not.toBeInTheDocument();

    expect(screen.getByLabelText('ruleTemplate.editModal.rule')).toHaveValue(
      ruleData.desc
    );
    expect(screen.getByLabelText('ruleTemplate.editModal.rule')).toBeDisabled();

    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleTypeLabel')
    ).toHaveValue(ruleData.type);
    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleTypeLabel')
    ).toBeDisabled();

    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleDbType')
    ).toHaveValue(ruleData.db_type);
    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleDbType')
    ).toBeDisabled();

    expect(screen.getByTitle('ruleTemplate.ruleLevel.error')).toHaveTextContent(
      'ruleTemplate.ruleLevel.error'
    );
  });

  test('should be able to modify the value of level', async () => {
    const submitFunction = jest.fn();
    render(
      <RuleManagerModal
        visible={true}
        ruleData={ruleData}
        setVisibleFalse={jest.fn()}
        submit={submitFunction}
      />
    );
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
    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(submitFunction).toBeCalledTimes(1);
    expect(submitFunction).toBeCalledWith({
      rule_name: 'ddl_check_collation_database',
      desc: '建议使用规定的数据库排序规则',
      level: 'normal',
      type: 'DDL规范',
      db_type: 'mysql',
      params: undefined,
    });
  });

  test('should be able to modify the value when params are present', async () => {
    const submitFunction = jest.fn();
    render(
      <RuleManagerModal
        visible={true}
        ruleData={editRuleData}
        setVisibleFalse={jest.fn()}
        submit={submitFunction}
      />
    );

    expect(
      screen.getByLabelText(editRuleData?.params?.[0].desc ?? '')
    ).toHaveValue(editRuleData?.params?.[0].value ?? '');

    expect(
      screen.getByLabelText(editRuleData?.params?.[1].desc ?? '')
    ).toHaveValue(editRuleData?.params?.[1].value ?? '');

    expect(
      screen.getByLabelText(editRuleData?.params?.[2].desc ?? '')
    ).toHaveAttribute('aria-checked', editRuleData?.params?.[2].value);

    fireEvent.change(
      screen.getByLabelText(editRuleData?.params?.[0].desc ?? ''),
      { target: { value: 'change_str' } }
    );

    fireEvent.change(
      screen.getByLabelText(editRuleData?.params?.[1].desc ?? ''),
      { target: { value: '345' } }
    );

    fireEvent.click(
      screen.getByLabelText(editRuleData?.params?.[2].desc ?? '')
    );

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(submitFunction).toBeCalledTimes(1);
    expect(submitFunction).toBeCalledWith({
      ...editRuleData,
      params: [
        {
          value: 'change_str',
          type: 'string',
          key: 'str_key',
          desc: 'str_desc',
        },
        { value: '345', type: 'int', key: 'int_key', desc: 'ine_desc' },
        { value: 'true', type: 'bool', key: 'radio_key', desc: 'radio_desc' },
      ],
    });
  });

  test('should resetFiled while click close', async () => {
    const setVisibleFalse = jest.fn();
    render(
      <RuleManagerModal
        visible={true}
        ruleData={ruleData}
        setVisibleFalse={setVisibleFalse}
        submit={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText('common.close'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByLabelText('ruleTemplate.editModal.rule')).toHaveValue(
      ''
    );

    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleTypeLabel')
    ).toHaveValue('');

    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleDbType')
    ).toHaveValue('');

    expect(
      screen.getByLabelText('ruleTemplate.editModal.ruleLevelLabel')
    ).toHaveValue('');
    expect(setVisibleFalse).toBeCalledTimes(1);
  });
});
