import CreateRuleTemplate from '.';
import rule_template from '../../../api/rule_template';
import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { resolveThreeSecond, mockDriver } from '../../../testUtils/mockRequest';

import { allRulesWithType } from '../../Rule/__testData__';
import { IRuleReqV1 } from '../../../api/common';
import { useParams } from 'react-router-dom';
import { selectCustomOptionByClassName } from '../../../testUtils/customQuery';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

describe('RuleTemplate/CreateRuleTemplate', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockGetAllRules();
    mockDriver();
    useParamsMock.mockReturnValue({ projectName });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAllRules = () => {
    const spy = jest.spyOn(rule_template, 'getRuleListV1');
    spy.mockImplementation(() => resolveThreeSecond(allRulesWithType));
    return spy;
  };

  const mockCreateTemplate = () => {
    const spy = jest.spyOn(rule_template, 'createProjectRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should render base form at init', async () => {
    const { container } = renderWithThemeAndRouter(<CreateRuleTemplate />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should jump to next step when user input all require fields', async () => {
    const createTemplateSpy = mockCreateTemplate();
    renderWithThemeAndRouter(<CreateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName'),
      {
        target: { value: 'testRuleTemplateId' },
      }
    );
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      {
        target: { value: 'rule template desc' },
      }
    );
    selectCustomOptionByClassName(
      'ruleTemplate.ruleTemplateForm.databaseType',
      'database-type-logo-wrapper',
      0
    );

    fireEvent.click(screen.getByText('common.nextStep'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).not.toHaveAttribute('hidden');

    fireEvent.click(screen.getByText('common.prevStep'));
    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).toHaveAttribute('hidden');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('testRuleTemplateId');
    fireEvent.click(screen.getByText('common.nextStep'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).not.toHaveAttribute('hidden');

    expect(screen.getByTestId('rule-list')).toMatchSnapshot();
    fireEvent.click(
      screen.getByText('ruleTemplate.ruleTemplateForm.disableAllRules')
    );
    expect(screen.getByTestId('rule-list')).toMatchSnapshot();
    fireEvent.click(
      screen.getByText('ruleTemplate.ruleTemplateForm.activeAllRules')
    );
    expect(screen.getByTestId('rule-list')).toMatchSnapshot();
    fireEvent.click(
      screen.getAllByText('ruleTemplate.ruleTemplateForm.disableRule')[0]
    );

    fireEvent.click(screen.getByText('common.submit'));

    expect(createTemplateSpy).toBeCalledTimes(1);
    const resultRuleName: IRuleReqV1[] = allRulesWithType
      .filter((e) => e.db_type === 'oracle')
      .map((rule) => {
        return {
          is_custom_rule: !!rule.is_custom_rule,
          name: rule.rule_name,
          level: rule.level,
          params: rule.params.map((v) => ({ key: v.key, value: v.value })),
        };
      });
    resultRuleName.shift();
    expect(createTemplateSpy).toBeCalledWith({
      db_type: 'oracle',
      rule_template_name: 'testRuleTemplateId',
      desc: 'rule template desc',
      rule_list: resultRuleName,
      project_name: projectName,
    });
  });
});
