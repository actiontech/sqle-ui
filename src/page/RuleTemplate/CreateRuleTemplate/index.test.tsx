import CreateRuleTemplate from '.';
import rule_template from '../../../api/rule_template';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
  renderWithThemeAndRouter,
  renderWithThemeAndServerRouter,
} from '../../../testUtils/customRender';
import {
  mockUseInstance,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { createMemoryHistory } from 'history';
import { allRules } from '../../Rule/__testData__';

describe('RuleTemplate/CreateRuleTemplate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseInstance();
    mockGetAllRules();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAllRules = () => {
    const spy = jest.spyOn(rule_template, 'getRuleListV1');
    spy.mockImplementation(() => resolveThreeSecond(allRules));
    return spy;
  };

  const mockCreateTemplate = () => {
    const spy = jest.spyOn(rule_template, 'createRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should render base form at init', async () => {
    const { container } = renderWithThemeAndRouter(<CreateRuleTemplate />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should jump to /rule/template when user click back btn', async () => {
    const history = createMemoryHistory();

    renderWithThemeAndServerRouter(<CreateRuleTemplate />, undefined, {
      history,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(history.location.pathname).toBe('/');
    expect(screen.getByText('common.back')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.back'));
    expect(history.location.pathname).toBe('/rule/template');
  });

  test('should jump to next step when user input all require fields', async () => {
    const createTemplateSpy = mockCreateTemplate();
    renderWithThemeAndRouter(<CreateRuleTemplate />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
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
    fireEvent.mouseDown(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.instances')
    );

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const option = screen.getAllByText('instance1')[1];
    expect(option).toHaveClass('ant-select-item-option-content');
    fireEvent.click(option);

    fireEvent.click(screen.getByText('common.nextStep'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).not.toHaveAttribute('hidden');

    fireEvent.click(screen.getByText('common.prevStep'));
    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).toHaveAttribute('hidden');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('testRuleTemplateId');
    fireEvent.click(screen.getByText('common.nextStep'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
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
    const resultRuleName = allRules.map((e) => e.rule_name);
    resultRuleName.shift();
    expect(createTemplateSpy).toBeCalledWith({
      rule_template_name: 'testRuleTemplateId',
      desc: 'rule template desc',
      instance_name_list: ['instance1'],
      rule_name_list: resultRuleName,
    });
    // await waitFor(() => {
    //   jest.advanceTimersByTime(3000);
    // });
    // expect(screen.getByTestId('rule-list')).toHaveAttribute('hidden');
    // expect(screen.getByTestId('submit-result')).not.toHaveAttribute('hidden');
    // // fireEvent.click(screen.getByText('ruleTemplate.backToList'));
    // // expect(history.location.pathname).toBe('/rule/template');

    // fireEvent.click(
    //   screen.getByText('ruleTemplate.createRuleTemplate.createNew')
    // );

    // expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    // expect(
    //   screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    // ).toHaveValue('');
    // expect(container).toMatchSnapshot();
  });
});
