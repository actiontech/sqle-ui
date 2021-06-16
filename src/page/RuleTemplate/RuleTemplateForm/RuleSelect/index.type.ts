import { IRuleResV1 } from '../../../../api/common';

export type RuleSelectProps = {
  listLoading: boolean;
  allRules: IRuleResV1[];
  activeRule: IRuleResV1[];
  updateActiveRule: (value: IRuleResV1[]) => void;
};
