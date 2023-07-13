import rule_template from '../../../api/rule_template';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { customRules } from './data';

export const mockGetCustomRules = () => {
  const spy = jest.spyOn(rule_template, 'getCustomRulesV1');
  spy.mockImplementation(() => resolveThreeSecond(customRules));
  return spy;
};

export const mockDeleteCustomRule = () => {
  const spy = jest.spyOn(rule_template, 'deleteCustomRuleV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockCreateCustomRule = () => {
  const spy = jest.spyOn(rule_template, 'createCustomRuleV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockUpdateCustomRule = () => {
  const spy = jest.spyOn(rule_template, 'updateCustomRuleV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockGetCustomRule = () => {
  const spy = jest.spyOn(rule_template, 'getCustomRuleV1');
  spy.mockImplementation(() => resolveThreeSecond(customRules[0]));
  return spy;
};
