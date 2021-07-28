import reducers, { updateSelectRuleTemplate } from '.';
import { ruleTemplateListData } from '../../page/RuleTemplate/__testData__';

describe('store/ruleTemplate', () => {
  test('should create action', () => {
    expect(
      updateSelectRuleTemplate({ ruleTemplate: ruleTemplateListData[0] })
    ).toEqual({
      type: 'ruleTemplate/updateSelectRuleTemplate',
      payload: { ruleTemplate: ruleTemplateListData[0] },
    });
  });

  test('should update select rule template when dispatch updateSelectRuleTemplate action', () => {
    const state = { selectRuleTemplate: null, modalStatus: {} };
    const newState = reducers(
      state,
      updateSelectRuleTemplate({ ruleTemplate: ruleTemplateListData[0] })
    );
    expect(newState.selectRuleTemplate).toBe(ruleTemplateListData[0]);
  });
});
