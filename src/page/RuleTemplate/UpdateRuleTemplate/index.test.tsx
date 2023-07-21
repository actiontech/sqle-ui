import { act, screen, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import UpdateRuleTemplate from '.';
import rule_template from '../../../api/rule_template';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import {
  resolveThreeSecond,
  mockDriver,
  mockInstanceTip,
} from '../../../testUtils/mockRequest';
import {
  ruleTemplateData,
  ruleTemplateDataWithSpecialName,
} from '../__testData__';

import { allRulesWithType } from '../../Rule/__testData__';
import { IRuleReqV1 } from '../../../api/common';

const templateName = 'mysql-1';
const projectName = 'default';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});

describe('UpdateRuleTemplate', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ templateName, projectName });
    mockGetRuleTemplate();
    mockGetAllRules();
    mockDriver();
    mockInstanceTip();
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

  const mockGetRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'getProjectRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(ruleTemplateData));
    return spy;
  };

  const mockUpdateRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'updateProjectRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should render base form at init', async () => {
    const { container } = renderWithThemeAndRouter(<UpdateRuleTemplate />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  // test('should jump to /project/default/rule/template when user click back btn', async () => {
  //   const history = createMemoryHistory();
  //   renderWithThemeAndServerRouter(<UpdateRuleTemplate />, undefined, {
  //     history,
  //   });
  //   await waitFor(() => {
  //     jest.advanceTimersByTime(3000);
  //   });
  //   expect(history.location.pathname).toBe('/');
  //   expect(screen.getByText('common.back')).toBeInTheDocument();
  //   fireEvent.click(screen.getByText('common.back'));
  //   expect(history.location.pathname).toBe('/project/default/rule/template');
  // });

  test('should jump to next step when user input all require fields', async () => {
    const updateTemplateSpy = mockUpdateRuleTemplate();
    renderWithThemeAndRouter(<UpdateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      {
        target: { value: 'rule template desc' },
      }
    );
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.databaseType')
    ).toBeDisabled();

    fireEvent.click(screen.getByText('common.nextStep'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).not.toHaveAttribute('hidden');

    fireEvent.click(screen.getByText('common.prevStep'));
    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).toHaveAttribute('hidden');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('default_mysql');
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

    expect(updateTemplateSpy).toBeCalledTimes(1);
    const resultRuleName: IRuleReqV1[] = allRulesWithType
      .filter((e) => e.db_type === 'mysql')
      .map((rule) => {
        return {
          is_custom_rule: !!rule.is_custom_rule,
          name: rule.rule_name,
          level: rule.level,
          params: rule.params.map((v) => ({ key: v.key, value: v.value })),
        };
      });
    resultRuleName.shift();
    expect(updateTemplateSpy).toBeCalledWith({
      rule_template_name: 'default_mysql',
      desc: 'rule template desc',
      rule_list: resultRuleName,
      project_name: projectName,
    });
  });

  it('should not check rule template name when update rule template', async () => {
    const getRuleTemplate = mockGetRuleTemplate();
    getRuleTemplate.mockImplementation(() =>
      resolveThreeSecond(ruleTemplateDataWithSpecialName)
    );
    renderWithThemeAndRouter(<UpdateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      {
        target: { value: 'rule template desc' },
      }
    );
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.databaseType')
    ).toBeDisabled();

    fireEvent.click(screen.getByText('common.nextStep'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).not.toHaveAttribute('hidden');
  });
});
