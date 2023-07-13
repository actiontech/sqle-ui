import CustomRuleList from './CustomRuleList';

export type FilterFormAndCreateButtonProps = {
  getCustomRuleList: (dbType: string, ruleName: string) => void;
};

export default CustomRuleList;
