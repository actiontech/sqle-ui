import { ListProps } from 'antd';
import React from 'react';
import { IRuleResV1 } from '../../api/common.d';

export type RuleListProps = {
  list: IRuleResV1[];
  actions?: (item: IRuleResV1) => React.ReactNode[] | undefined;
  listProps?: ListProps<IRuleResV1>;
  tabChange?: (tab: string) => void;
  currentTab?: string;
  allRuleTabs?: string[];
};

export type TabRuleItem = {
  tabTitle: string;
  rules: IRuleResV1[];
  len: number;
};
