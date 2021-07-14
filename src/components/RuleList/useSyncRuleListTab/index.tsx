import { useCallback, useEffect, useState } from 'react';
import { IRuleResV1 } from '../../../api/common';
import { RuleListDefaultTabKey } from '../../../data/common';

const useSyncRuleListTab = (allRules?: IRuleResV1[]) => {
  const [tabKey, setTabKey] = useState(RuleListDefaultTabKey);
  const [allTypes, setAllTypes] = useState<string[]>([]);

  const tabChange = useCallback((currentKey: string) => {
    setTabKey(currentKey);
  }, []);

  useEffect(() => {
    if (allRules && allRules.length > 0) {
      const set = new Set<string>();
      allRules.forEach((rule) => {
        if (rule.type) {
          set.add(rule.type);
        }
      });
      setAllTypes(Array.from(set));
    }
  }, [allRules]);

  return {
    tabKey,
    allTypes,
    setTabKey,
    tabChange,
  };
};

export default useSyncRuleListTab;
