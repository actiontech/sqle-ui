import { ICustomRuleResV1 } from '../../../api/common';
import { CustomRuleResV1LevelEnum } from '../../../api/common.enum';

export const customRules: ICustomRuleResV1[] = [
  {
    db_type: 'mysql',
    annotation: 'desc desc desc',
    level: CustomRuleResV1LevelEnum.notice,
    rule_id: '1',
    desc: 'name1',
    rule_script: 'w+',
    type: 'rule_type1',
  },
  {
    db_type: 'oracle',
    annotation: 'desc desc desc',
    level: CustomRuleResV1LevelEnum.error,
    rule_id: '2',
    desc: 'name2',
    rule_script: 'w+',
    type: 'rule_type2',
  },
];
