import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import RuleSelect from '.';
import { IRuleResV1 } from '../../../../api/common';
import { allRules } from '../../../Rule/__testData__';

describe('RuleTemplate/RuleTemplateForm/RuleSelect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('should render rule by active rules and all rules', () => {
    const { container, rerender } = render(
      <RuleSelect
        listLoading={true}
        allRules={allRules as IRuleResV1[]}
        activeRule={[]}
        updateActiveRule={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <RuleSelect
        listLoading={false}
        allRules={allRules as IRuleResV1[]}
        activeRule={[]}
        updateActiveRule={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <RuleSelect
        listLoading={false}
        allRules={allRules as IRuleResV1[]}
        activeRule={
          allRules.slice(0, Math.floor(allRules.length / 2)) as IRuleResV1[]
        }
        updateActiveRule={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should call update rules func of props when user active or disable rule', () => {
    const updateActiveRuleMock = jest.fn();
    const { rerender } = render(
      <RuleSelect
        listLoading={false}
        allRules={allRules as IRuleResV1[]}
        activeRule={[]}
        updateActiveRule={updateActiveRuleMock}
      />
    );
    fireEvent.click(
      screen.getAllByText('ruleTemplate.ruleTemplateForm.activeRule')[0]
    );
    const active = [allRules[0]];
    expect(updateActiveRuleMock).toBeCalledTimes(1);
    expect(updateActiveRuleMock).toBeCalledWith(active);

    fireEvent.click(
      screen.getByText('ruleTemplate.ruleTemplateForm.activeAllRules')
    );
    expect(updateActiveRuleMock).toBeCalledTimes(2);
    expect(updateActiveRuleMock).toBeCalledWith(allRules);

    rerender(
      <RuleSelect
        listLoading={false}
        allRules={allRules as IRuleResV1[]}
        activeRule={allRules as IRuleResV1[]}
        updateActiveRule={updateActiveRuleMock}
      />
    );

    fireEvent.click(
      screen.getByText('ruleTemplate.ruleTemplateForm.disableAllRules')
    );

    expect(updateActiveRuleMock).toBeCalledTimes(3);
    expect(updateActiveRuleMock).toBeCalledWith([]);

    fireEvent.click(
      screen.getAllByText('ruleTemplate.ruleTemplateForm.disableRule')[0]
    );
    const temp = cloneDeep(allRules);
    allRules.shift();
    expect(updateActiveRuleMock).toBeCalledTimes(4);
    expect(updateActiveRuleMock).toBeCalledWith(temp);
  });

  test('should can render edit rule modal', async () => {
    const updateActiveRuleFunction = jest.fn();
    render(
      <RuleSelect
        listLoading={false}
        allRules={allRules as IRuleResV1[]}
        activeRule={allRules as IRuleResV1[]}
        updateActiveRule={updateActiveRuleFunction}
      />
    );

    expect(
      screen.getAllByText('ruleTemplate.ruleTemplateForm.editRule')[0]
    ).toBeEnabled();
    fireEvent.click(
      screen.getAllByText('ruleTemplate.ruleTemplateForm.editRule')[0]
    );
    expect(
      screen.getAllByText('ruleTemplate.editModal.title')[0]
    ).toHaveTextContent('ruleTemplate.editModal.title');
    fireEvent.click(screen.getAllByText('common.submit')[0]);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(updateActiveRuleFunction).toBeCalledTimes(1);
    expect(updateActiveRuleFunction).toBeCalledWith(allRules);
  });
});
