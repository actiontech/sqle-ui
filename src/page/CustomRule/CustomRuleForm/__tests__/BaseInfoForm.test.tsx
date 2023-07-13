import { fireEvent, render, screen } from '@testing-library/react';
import BaseInfoForm from '../BaseInfoForm';
import { renderHook } from '@testing-library/react-hooks';
import { Form } from 'antd';
import { ICustomRuleResV1 } from '../../../../api/common';
import { mockDriver, mockUseRuleType } from '../../../../testUtils/mockRequest';
import { customRules } from '../../__mockApi__/data';
import { act } from 'react-dom/test-utils';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';

describe('test BaseInfoForm', () => {
  const mockSubmit = jest.fn();
  let getRuleTypesSpy: jest.SpyInstance;
  let getDriver: jest.SpyInstance;

  beforeEach(() => {
    getRuleTypesSpy = mockUseRuleType();
    getDriver = mockDriver();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const renderBaseInfoForm = (defaultData?: ICustomRuleResV1) => {
    const { result } = renderHook(() => Form.useForm());

    return render(
      <BaseInfoForm
        form={result.current[0]}
        submit={mockSubmit}
        defaultData={defaultData}
      />
    );
  };
  test('should match snapshot', async () => {
    const { container } = renderBaseInfoForm();

    expect(container).toMatchSnapshot();
  });

  test('should set default data when "defaultData" props is not undefined', async () => {
    const { container } = renderBaseInfoForm(customRules[0]);
    expect(container).toMatchSnapshot();
    expect(
      screen.getByLabelText('customRule.baseInfoForm.ruleName')
    ).toHaveValue(customRules[0].rule_name);

    expect(getRuleTypesSpy).toBeCalledTimes(1);
    expect(getRuleTypesSpy).nthCalledWith(1, {
      db_type: customRules[0].db_type,
    });
  });

  test('should get rule type when changed dbType', async () => {
    renderBaseInfoForm();

    expect(getDriver).toBeCalledTimes(1);
    expect(getRuleTypesSpy).toBeCalledTimes(0);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('customRule.baseInfoForm.dbType', 'mysql');
    await act(async () => jest.advanceTimersByTime(0));

    expect(getRuleTypesSpy).toBeCalledTimes(1);
    expect(getRuleTypesSpy).nthCalledWith(1, {
      db_type: 'mysql',
    });
  });

  test('should called "submit" props when click next step button', async () => {
    renderBaseInfoForm();

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.change(
      screen.getByLabelText('customRule.baseInfoForm.ruleName'),
      {
        target: { value: 'rule_name' },
      }
    );

    fireEvent.change(
      screen.getByLabelText('customRule.baseInfoForm.ruleDesc'),
      {
        target: { value: 'rule_desc' },
      }
    );

    selectOptionByIndex('customRule.baseInfoForm.dbType', 'mysql');
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      screen.getByLabelText('customRule.baseInfoForm.ruleType')
    );

    await screen.findByText('customRule.baseInfoForm.addExtraRuleType');
    await screen.findByTestId('add-rule-type');

    fireEvent.change(screen.getByTestId('add-rule-type'), {
      target: { value: 'custom_rule' },
    });

    fireEvent.click(
      screen.getByText('customRule.baseInfoForm.addExtraRuleType')
    );
    fireEvent.click(
      screen.getByText('customRule.baseInfoForm.addExtraRuleType')
    );

    fireEvent.click(screen.getByText('common.nextStep'));
    expect(mockSubmit).toBeCalledTimes(1);
  });

  test('should reset form when clicked reset button', async () => {
    const { baseElement } = renderBaseInfoForm(customRules[0]);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      screen.getByLabelText('customRule.baseInfoForm.ruleType')
    );

    await screen.findByText('customRule.baseInfoForm.addExtraRuleType');
    await screen.findByTestId('add-rule-type');

    fireEvent.change(screen.getByTestId('add-rule-type'), {
      target: { value: 'custom_rule' },
    });

    fireEvent.click(
      screen.getByText('customRule.baseInfoForm.addExtraRuleType')
    );
    fireEvent.click(
      screen.getByText('customRule.baseInfoForm.addExtraRuleType')
    );

    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.reset'));
    expect(baseElement).toMatchSnapshot();
  });
});
