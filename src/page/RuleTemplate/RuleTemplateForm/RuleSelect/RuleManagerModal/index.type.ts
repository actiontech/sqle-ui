import { IRuleResV1 } from '../../../../../api/common';
import { RuleResV1LevelEnum } from '../../../../../api/common.enum';

export type RuleManagerFormProps = {
  visible: boolean;
  ruleData?: IRuleResV1 | undefined;
  setVisibleFalse: () => void;
  submit: (values: IRuleResV1) => void;
};

export interface IRuleManagerForm {
  rule_name: string;
  desc: string;
  annotation: string;
  type: string;
  db_type: string;
  level?: RuleResV1LevelEnum;
  params: Record<string, boolean | string>;
}
