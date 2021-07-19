import { IRuleResV1 } from '../../../../../api/common';

export type RuleManagerFormProps = {
  visible: boolean;
  ruleData?: IRuleResV1 | undefined;
  setVisibleFalse: () => void;
  submit: (values: IRuleResV1) => void;
};
