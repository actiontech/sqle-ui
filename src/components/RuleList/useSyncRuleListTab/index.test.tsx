import { act, renderHook } from '@testing-library/react-hooks';
import useSyncRuleListTab from '.';
import { RuleListDefaultTabKey } from '../../../data/common';

describe('useSyncRuleListTab', () => {
  test('tab key should be default key', () => {
    const { result } = renderHook(() => useSyncRuleListTab());
    expect(result.current.tabKey).toBe(RuleListDefaultTabKey);
  });

  test('should generate array includes all type of rule', () => {
    const ruleList = [
      {
        rule_name: '1',
        type: 'type1',
      },
      {
        rule_name: '1',
        type: 'type2',
      },
      {
        rule_name: '1',
        type: 'type2',
      },
      {
        rule_name: '1',
        type: 'type3',
      },
      {
        rule_name: '1',
        type: 'type1',
      },
    ];
    const { result } = renderHook(() => useSyncRuleListTab(ruleList));
    expect(result.current.allTypes).toEqual(['type1', 'type2', 'type3']);
  });

  test('should update tabKey when tabChange was called', () => {
    const { result } = renderHook(() => useSyncRuleListTab());
    expect(result.current.tabKey).toBe(RuleListDefaultTabKey);
    act(() => {
      result.current.tabChange('type2');
    });
    expect(result.current.tabKey).toBe('type2');
  });
});
