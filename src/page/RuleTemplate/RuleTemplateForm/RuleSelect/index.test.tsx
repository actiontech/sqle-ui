import { fireEvent, render, screen } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import RuleSelect from '.';
import { IRuleResV1 } from '../../../../api/common';
import { allRules } from '../../../Rule/__testData__';

describe('RuleTemplate/RuleTemplateForm/RuleSelect', () => {
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
      screen.getByText('ruleTemplate.ruleTemplateForm.activeAllRules')
    );
    expect(updateActiveRuleMock).toBeCalledTimes(1);
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

    expect(updateActiveRuleMock).toBeCalledTimes(2);
    expect(updateActiveRuleMock).toBeCalledWith([]);

    fireEvent.click(
      screen.getAllByText('ruleTemplate.ruleTemplateForm.disableRule')[0]
    );
    const temp = cloneDeep(allRules);
    allRules.shift();
    expect(updateActiveRuleMock).toBeCalledTimes(3);
    expect(updateActiveRuleMock).toBeCalledWith(temp);
  });
});
