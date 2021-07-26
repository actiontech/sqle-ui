import { waitFor, screen, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import UpdateRuleTemplate from '.';
import rule_template from '../../../api/rule_template';
import {
  renderWithThemeAndRouter,
  renderWithThemeAndServerRouter,
} from '../../../testUtils/customRender';
import {
  mockUseInstance,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { ruleTemplateData } from '../__testData__';
import { createMemoryHistory } from 'history';
import { allRules } from '../../Rule/__testData__';

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
    useParamsMock.mockReturnValue({ templateName: 'template_name1' });
    mockGetRuleTemplate();
    mockGetAllRules();
    mockUseInstance();
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

  const mockGetRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'getRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(ruleTemplateData));
    return spy;
  };

  const mockUpdateRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'updateRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should render base form at init', async () => {
    const { container } = renderWithThemeAndRouter(<UpdateRuleTemplate />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should jump to /rule/template when user click back btn', async () => {
    const history = createMemoryHistory();

    renderWithThemeAndServerRouter(<UpdateRuleTemplate />, undefined, {
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
    const updateTemplateSpy = mockUpdateRuleTemplate();
    renderWithThemeAndRouter(<UpdateRuleTemplate />);
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

    expect(updateTemplateSpy).toBeCalledTimes(1);
    const resultRuleName = allRules.map((rule) => {
      return {
        name: rule.rule_name,
        level: rule.level,
        desc: rule.desc,
        value: rule.value,
      };
    });
    resultRuleName.shift();
    expect(updateTemplateSpy).toBeCalledWith({
      rule_template_name: 'testRuleTemplateId',
      desc: 'rule template desc',
      instance_name_list: ['instance1'],
      rule_list: resultRuleName,
    });
    // await waitFor(() => {
    //   jest.advanceTimersByTime(3000);
    // });
    // expect(screen.getByTestId('rule-list')).toHaveAttribute('hidden');
    // expect(screen.getByTestId('submit-result')).not.toHaveAttribute('hidden');
  });
});
