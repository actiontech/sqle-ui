import { act, fireEvent, screen } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import RuleSelect from '.';
import { IRuleResV1 } from '../../../../api/common';
import { allRulesWithType } from '../../../Rule/__testData__';
import { renderWithTheme } from '../../../../testUtils/customRender';
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material/styles';
import lightTheme from '../../../../theme/light';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

describe('RuleTemplate/RuleTemplateForm/RuleSelect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('should render rule by active rules and all rules', () => {
    const { container, rerender } = renderWithTheme(
      <RuleSelect
        listLoading={true}
        allRules={allRulesWithType as IRuleResV1[]}
        activeRule={[]}
        updateActiveRule={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>
          <RuleSelect
            listLoading={false}
            allRules={allRulesWithType as IRuleResV1[]}
            activeRule={[]}
            updateActiveRule={jest.fn()}
          />
        </ThemeProvider>
      </StyledEngineProvider>
    );
    expect(container).toMatchSnapshot();
    rerender(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>
          <RuleSelect
            listLoading={false}
            allRules={allRulesWithType as IRuleResV1[]}
            activeRule={
              allRulesWithType.slice(
                0,
                Math.floor(allRulesWithType.length / 2)
              ) as IRuleResV1[]
            }
            updateActiveRule={jest.fn()}
          />
        </ThemeProvider>
      </StyledEngineProvider>
    );
    expect(container).toMatchSnapshot();
  });

  test('should call update rules func of props when user active or disable rule', () => {
    const updateActiveRuleMock = jest.fn();
    const { rerender } = renderWithTheme(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>
          <RuleSelect
            listLoading={false}
            allRules={allRulesWithType as IRuleResV1[]}
            activeRule={[]}
            updateActiveRule={updateActiveRuleMock}
          />
        </ThemeProvider>
      </StyledEngineProvider>
    );
    fireEvent.click(
      screen.getAllByText('ruleTemplate.ruleTemplateForm.activeRule')[0]
    );
    const active = [allRulesWithType[0]];
    expect(updateActiveRuleMock).toBeCalledTimes(1);
    expect(updateActiveRuleMock).toBeCalledWith(active);

    fireEvent.click(
      screen.getByText('ruleTemplate.ruleTemplateForm.activeAllRules')
    );
    expect(updateActiveRuleMock).toBeCalledTimes(2);
    expect(updateActiveRuleMock).toBeCalledWith(allRulesWithType);

    rerender(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>
          <RuleSelect
            listLoading={false}
            allRules={allRulesWithType as IRuleResV1[]}
            activeRule={allRulesWithType as IRuleResV1[]}
            updateActiveRule={updateActiveRuleMock}
          />
        </ThemeProvider>
      </StyledEngineProvider>
    );

    fireEvent.click(
      screen.getByText('ruleTemplate.ruleTemplateForm.disableAllRules')
    );

    expect(updateActiveRuleMock).toBeCalledTimes(3);
    expect(updateActiveRuleMock).toBeCalledWith([]);

    fireEvent.click(
      screen.getAllByText('ruleTemplate.ruleTemplateForm.disableRule')[0]
    );
    const temp = cloneDeep(allRulesWithType);
    allRulesWithType.shift();
    expect(updateActiveRuleMock).toBeCalledTimes(4);
    expect(updateActiveRuleMock).toBeCalledWith(temp);
  });

  test('should can render edit rule modal', async () => {
    const updateActiveRuleFunction = jest.fn();
    renderWithTheme(
      <RuleSelect
        listLoading={false}
        allRules={allRulesWithType as IRuleResV1[]}
        activeRule={allRulesWithType as IRuleResV1[]}
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
    fireEvent.click(screen.getAllByText('common.save')[0]);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateActiveRuleFunction).toBeCalledTimes(1);
    expect(updateActiveRuleFunction).toBeCalledWith(allRulesWithType);
  });
});
